import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'avby.settings')
django.setup()

import requests
import random
from typing import List
from bs4 import BeautifulSoup
from decimal import Decimal, InvalidOperation

from parser.services.db_service import DbService

from cars.models import CarLink

URL = "https://autobuy.by/cars?page="
HOME_URL = "https://autobuy.by"

def get_htmls(pages_count: int = 1):
    htmls = []
    for page in range(1, pages_count + 1):
        url = URL + str(page)
        responce = requests.get(url)
        status_code = responce.status_code
        if status_code != 200:
            raise Exception(f"Ошибка! Код {status_code}")
        htmls.append(responce)
    return htmls


def get_car_links(htmls: List[requests.Response], items_count: int = 1):
    car_links = []
    for html in htmls:
        soup = BeautifulSoup(html.text, "html.parser")

        # Поиск блока содержащего все машины
        block_cars = soup.find("div", class_="front__new-car")

        # Поиск машин внутри блока
        cars = block_cars.find_all("div", class_="car__item-front")
        for index, car in enumerate(cars):
            if items_count == index:
                break
            # Извлечение ссылки на фото
            car_link = car.find("a").get("href")
            # Проверка что ссылка получена и она не пустая
            if car_link != None and car_link != "":
                car_links.append(car_link)
            else:
                continue
    return car_links


def get_cars_html(car_links: List[str]):
    cars_html = []
    for link in car_links:

        if CarLink.objects.filter(link=link).exists(): # Проверка что машина в бд уже есть
            print("Такая машина уже существует")
            continue
        CarLink.objects.create(link=link) # Добавление линка машины в бд

        url = HOME_URL + link
        responce = requests.get(url)
        status_code = responce.status_code
        if status_code != 200:
            raise Exception(f"Ошибка! Код {status_code}")
        cars_html.append(responce)
    return cars_html


def get_cars_info(cars_html: List[requests.Response], return_result: bool = False):
    cars = []
    for html in cars_html:
        soup = BeautifulSoup(html.text, "html.parser")

        # Поиск элементов на странице
        name_element = soup.find("h1", class_="title_main big-title")
        price_element = soup.find("span", class_="price__byn")
        description_element = soup.find("div", class_="car__msg")
        params_name_elements = soup.find_all("div", class_="params__name")
        params_value_elements = soup.find_all("p", class_="params__value")
        photos_elements = soup.find("div", class_="car-info__wrap").find_all("picture")

        # Поиск модели, бренда
        breadcrumb = soup.find_all("li", class_="breadcrumb-item")
        brand = breadcrumb[2].text
        model = breadcrumb[3].text
        print(brand)
        # Проверка наличия элементов
        if not all([name_element, price_element, description_element, params_name_elements, params_value_elements, photos_elements]):
            print("Не удалось найти все необходимые элементы на странице.")
            continue

        name = name_element.text
        price_str = price_element.text
        description = description_element.text.strip().replace("\r", "").replace("\n", "")
        params_name = [param.text.strip() for param in params_name_elements]
        params_value = [param.text.strip() for param in params_value_elements]
        params_dict = dict(zip(params_name, params_value))

        # Извлечение даты
        year = params_dict.get('Год выпуска', '').split(' ')[0]
        # Перевод параметров в строку

        # Получение ссылок на фото машины
        photo_links = []
        for index, photo in enumerate(photos_elements):
            if index >= 5:
                break
            photo_link = photo.find("img")
            if photo_link:
                photo_links.append(photo_link.get("src"))

        # Преобразование цены в Decimal
        try:
            price_decimal = Decimal(price_str.replace("руб", "").replace(" ", ""))
        except InvalidOperation:
            print("Не удалось преобразовать цену в Decimal.")
            continue

        # Создание словаря с информацией о машине
        car = {
            "name": name,
            "brand": brand,
            "model": model,
            "price": str(price_decimal),
            "description": description,
            "year": year,
            "params": params_dict,
            "photo_links": photo_links,
        }

        db.save_car(car)



def start_parsing():
    try:
        global db
        db = DbService()

        htmls = get_htmls(pages_count=10)
        car_links = get_car_links(htmls, items_count=10)
        cars_html = get_cars_html(car_links)
        get_cars_info(cars_html)
    except Exception as e:
        print(f"Ошибка при парсинге: {e}")
        return None

if __name__ == "__main__":
    start_parsing()
