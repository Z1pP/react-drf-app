import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'avby.settings')
django.setup()


from typing import List
from bs4 import BeautifulSoup
from decimal import Decimal, InvalidOperation
from parser.services.db_service import DbService
import logging
import aiohttp
import asyncio



URL = "https://autobuy.by/cars?page="
HOME_URL = "https://autobuy.by"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


async def fetch(session, url):
    async with session.get(url) as response:
        if response.status != 200:
            logging.error(f"Ошибка загрузки страницы {url}. Код {response.status}")
            return None
        return await response.text()


async def get_htmls(pages_count: int) -> List[str]:
    """Функция получения html страниц"""
    if pages_count < 1:
        raise ValueError("Количество страниц должно быть больше нуля")

    htmls = []
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, URL + str(page)) for page in range(1, pages_count + 1)]
        htmls = await asyncio.gather(*tasks)

    htmls = [html for html in htmls if html is not None]
    logging.info(f"Получено {len(htmls)} страниц")
    return htmls


def get_car_links(htmls: List[str], items_count: int) -> List[str]:
    """Получение ссылок на машины"""
    car_links = []
    for html in htmls:
        soup = BeautifulSoup(html, "html.parser")

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
            if car_link:
                car_links.append(car_link)
    logging.info(f"Получено {len(car_links)} машин из {len(htmls)} страниц(ы)")
    return car_links


async def get_cars_html(car_links: List[str]) -> List[str]:
    """Получение html страниц машин"""
    cars_html = []
    async with aiohttp.ClientSession() as session:
        tasks = []
        for link in car_links:
            tasks.append(fetch(session, HOME_URL + link))

        cars_html = await asyncio.gather(*tasks)

    cars_html = [html for html in cars_html if html is not None]
    return cars_html


def get_cars_info(cars_html: List[str], return_result: bool = False):
    for html in cars_html:
        soup = BeautifulSoup(html, "html.parser")

        # Поиск элементов на странице
        name_element = soup.find("h1", class_="title_main big-title")
        price_element = soup.find("span", class_="price__byn")
        description_element = soup.find("div", class_="car__msg")
        params_name_elements = soup.find_all("div", class_="params__name")
        params_value_elements = soup.find_all("p", class_="params__value")
        photos_elements = soup.find("div", class_="car-info__wrap").find_all("picture")

        # Поиск модели, бренда
        breadcrumb = soup.find_all("li", class_="breadcrumb-item")
        brand = breadcrumb[2].text if len(breadcrumb) > 2 else "Неизвестно"
        model = breadcrumb[3].text if len(breadcrumb) > 3 else "Неизвестно"

        # Проверка наличия элементов
        if not all([name_element, price_element, description_element, params_name_elements, params_value_elements,
                    photos_elements]):
            logging.warning("Не удалось найти все необходимые элементы на странице.")
            continue

        name = name_element.text
        price_str = price_element.text
        description = description_element.text.strip().replace("\r", "").replace("\n", "")
        params_name = [param.text.strip() for param in params_name_elements]
        params_value = [param.text.strip() for param in params_value_elements]
        params_dict = dict(zip(params_name, params_value))

        # Извлечение года выпуска
        year = params_dict.get('Год выпуска', '').split(' ')[0]

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
            logging.error("Не удалось преобразовать цену в Decimal.")
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

        if return_result:
            return car

        db.save_car(car)

def start_parsing():
    try:
        global db
        db = DbService()

        htmls = asyncio.run(get_htmls(pages_count=10))
        car_links = get_car_links(htmls, items_count=50)
        cars_html = asyncio.run(get_cars_html(car_links))
        get_cars_info(cars_html)
    except Exception as e:
        logging.error(f"Ошибка при парсинге: {e}")

if __name__ == "__main__":
    start_parsing()

# import os
# import django
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'avby.settings')
# django.setup()
#
# import requests
# from typing import List
# from bs4 import BeautifulSoup
# from decimal import Decimal, InvalidOperation
#
# from parser.services.db_service import DbService
#
# from cars.models import CarLink
#
# URL = "https://autobuy.by/cars?page="
# HOME_URL = "https://autobuy.by"
#
# def get_htmls(pages_count: int) -> List[requests.Response]:
#     """Функция получения html страниц"""
#     if pages_count < 1:
#         raise ValueError("Количество страниц должно быть больше нуля")
#     htmls = []
#     for page in range(1, pages_count + 1):
#         url = URL + str(page)
#         response = requests.get(url)
#         status_code = response.status_code
#         if status_code != 200:
#             raise Exception(f"Ошибка загрузки страницы. Код {status_code}")
#         htmls.append(response)
#     print(f"Получено {len(htmls)} страниц")
#     return htmls
#
#
# def get_car_links(htmls: List[requests.Response], items_count: int) -> List[str]:
#     """Получение ссылок на машины"""
#     car_links = []
#     for html in htmls:
#         soup = BeautifulSoup(html.text, "html.parser")
#
#         # Поиск блока содержащего все машины
#         block_cars = soup.find("div", class_="front__new-car")
#
#         # Поиск машин внутри блока
#         cars = block_cars.find_all("div", class_="car__item-front")
#         for index, car in enumerate(cars):
#             if items_count == index:
#                 break
#             # Извлечение ссылки на фото
#             car_link = car.find("a").get("href")
#             # Проверка что ссылка получена и она не пустая
#             if car_link != None and car_link != "":
#                 car_links.append(car_link)
#             else:
#                 continue
#     print(f"Получено {len(car_links)} машин из {len(htmls)} страниц(ы)")
#     return car_links
#
#
# def get_cars_html(car_links: List[str]) -> List[requests.Response]:
#     """Получение html страниц машин"""
#     cars_html = []
#     for link in car_links:
#         # Проверка на наличие машины в бд
#         if CarLink.objects.filter(link=link).exists():
#             print("Такая машина уже существует")
#             continue
#         # Добавление линка машины в бд
#         CarLink.objects.create(link=link)
#
#         url = HOME_URL + link
#         response = requests.get(url)
#         status_code = response.status_code
#         if status_code != 200:
#             raise Exception(f"Ошибка! Код {status_code}")
#         cars_html.append(response)
#     return cars_html
#
#
# def get_cars_info(cars_html: List[requests.Response], return_result: bool = False):
#     for index, html in enumerate(cars_html):
#
#         print(f'Парсинг машины: {index + 1} из {len(cars_html)}')
#         # Парсинг html
#         soup = BeautifulSoup(html.text, "html.parser")
#
#         # Поиск элементов на странице
#         name_element = soup.find("h1", class_="title_main big-title")
#         price_element = soup.find("span", class_="price__byn")
#         description_element = soup.find("div", class_="car__msg")
#         params_name_elements = soup.find_all("div", class_="params__name")
#         params_value_elements = soup.find_all("p", class_="params__value")
#         photos_elements = soup.find("div", class_="car-info__wrap").find_all("picture")
#
#         # Поиск модели, бренда
#         breadcrumb = soup.find_all("li", class_="breadcrumb-item")
#         brand = breadcrumb[2].text
#         model = breadcrumb[3].text
#         print(brand)
#         # Проверка наличия элементов
#         if not all([name_element, price_element, description_element, params_name_elements, params_value_elements, photos_elements]):
#             print("Не удалось найти все необходимые элементы на странице.")
#             continue
#
#         name = name_element.text
#         price_str = price_element.text
#         description = description_element.text.strip().replace("\r", "").replace("\n", "")
#         params_name = [param.text.strip() for param in params_name_elements]
#         params_value = [param.text.strip() for param in params_value_elements]
#         params_dict = dict(zip(params_name, params_value))
#
#         # Извлечение даты
#         year = params_dict.get('Год выпуска', '').split(' ')[0]
#
#         # Получение ссылок на фото машины
#         photo_links = []
#         for index, photo in enumerate(photos_elements):
#             if index >= 5:
#                 break
#             photo_link = photo.find("img")
#             if photo_link:
#                 photo_links.append(photo_link.get("src"))
#
#         # Преобразование цены в Decimal
#         try:
#             price_decimal = Decimal(price_str.replace("руб", "").replace(" ", ""))
#         except InvalidOperation:
#             print("Не удалось преобразовать цену в Decimal.")
#             continue
#
#         # Создание словаря с информацией о машине
#         car = {
#             "name": name,
#             "brand": brand,
#             "model": model,
#             "price": str(price_decimal),
#             "description": description,
#             "year": year,
#             "params": params_dict,
#             "photo_links": photo_links,
#         }
#
#         db.save_car(car)
#
#         print(f"Сохранена машина: {car}")
#
#
#
# def start_parsing():
#     try:
#         global db
#         db = DbService()
#
#         htmls = get_htmls(pages_count=10)
#         car_links = get_car_links(htmls, items_count=10)
#         cars_html = get_cars_html(car_links)
#         get_cars_info(cars_html)
#     except Exception as e:
#         print(f"Ошибка при парсинге: {e}")
#         return None
#
# if __name__ == "__main__":
#     start_parsing()
