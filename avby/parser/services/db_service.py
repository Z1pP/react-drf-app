import os
import requests

from django.db import transaction, IntegrityError
from django.core.files import File
from django.utils.text import slugify

from cars.models import Car, CarPhoto, CarModel, CarBrand

class DbService:
    def _download_photo(self, photo_link: str):
        try:
            filename = photo_link.split("/")[-1]
            response = requests.get(photo_link)
            response.raise_for_status()
            return filename, response.content
        except requests.exceptions.RequestException as e:
            print(f"Не удалось загрузить фото: {e}")
            return None

    @transaction.atomic
    def save_car(self, data: dict):
        required_keys = ["name", "brand", "model", "price", "description", "year", "params", "photo_links"]

        if not all(key in data for key in required_keys):
            raise ValueError(f'Отсутствуют необходимые ключи в словаре: {required_keys}')

        name = data.get("name")
        brand = data.get("brand").strip().title()
        model = data.get("model").split(" ")[-1].strip().title()
        # Забираем параметры машины из данных и формируем словарь с параметрами машины.
        params = data.get("params")
        engine_copacity = params.get("Объем двигателя").split(" ")[0].strip()
        fuel_type = params.get("Тип двигателя").strip()
        transmission_type = params.get("Коробка передач").strip()
        drive_type = params.get("Привод").strip()
        car_body = params.get("Кузов").strip()
        milage = params.get("Пробег").split(" ")[0].strip().replace(",", "")
        year = data.get("year").strip()
        condition = params.get("Состояние").strip()
        color = params.get("Цвет авто")
        #  Забираем описание и цену из данных и формируем словарь с данными машины.
        description = data.get("description")
        price = data.get("price")
        photo_links = data.get("photo_links")

        # Получаем или создаем новые марку и модель
        brand_instance, _ = CarBrand.objects.get_or_create(name=brand,
                                                           defaults={'slug': slugify(brand)})
        model_instance, _ = CarModel.objects.get_or_create(name=model, car_brand=brand_instance,
                                                           defaults={'slug': slugify(model)})


        # Создаем новую машину
        try:
            new_car = Car.objects.create(
                name=name, brand=brand_instance, model=model_instance, year=year, engine_capacity=engine_copacity,
                fuel_type=fuel_type, transmission_type=transmission_type,
                drive_type=drive_type, car_body=car_body, milage=milage,
                condition=condition, color=color, description=description,
                price=price)
        except Exception as e:
            print(f"Не удалось создать машину: {e}")
            return None

        # Загружаем фотографии для машины
        for photo_link in photo_links:
            filename, photo_content = self._download_photo(photo_link)
            with open(filename, "wb") as file:
                file.write(photo_content)
            with open(filename, "rb") as file:
                django_file = File(file)
                new_photo = CarPhoto(photo=django_file, car=new_car)
                new_photo.save()
            # Удаляем временный файл
            os.remove(filename)
