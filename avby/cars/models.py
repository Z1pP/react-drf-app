from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify


# Create your models here.

class CarBrand(models.Model):
    name = models.CharField('Марка', max_length=100, unique=True)
    image = models.ImageField('Изображение марки', upload_to='cars_brands/', blank=True, null=True)
    slug = models.SlugField('Слуг марки', max_length=100, unique=True)

    class Meta:
        verbose_name = 'Марка автомобиля'
        verbose_name_plural = 'Марки автомобилей'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class CarModel(models.Model):
    name = models.CharField('Модель', max_length=100, unique=True)
    car_brand = models.ForeignKey(CarBrand, on_delete=models.CASCADE, related_name='models', verbose_name='Марка')
    slug = models.SlugField('Слуг модели', max_length=100, unique=True)

    class Meta:
        verbose_name = 'Модель автомобиля'
        verbose_name_plural = 'Модели автомобилей'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Car(models.Model):
    name = models.CharField('Название автомобиля', max_length=100)
    model = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='cars', verbose_name='Модель')
    brand = models.ForeignKey(CarBrand, on_delete=models.CASCADE, related_name='cars', verbose_name='Марка')
    slug = models.SlugField('Слуг автомобиля', max_length=100, unique=False)

    # Характеристики авто
    engine_capacity = models.CharField('Объем двигателя', max_length=20, blank=True)
    fuel_type = models.CharField('Тип топлива', max_length=20, blank=True)
    drive_type = models.CharField('Тип привода', max_length=20, blank=True)
    transmission_type = models.CharField('Тип трансмиссии', max_length=20, blank=True)
    car_body = models.CharField('Кузов', max_length=20, blank=True)
    milage = models.CharField('Пробег', max_length=20, blank=True)
    year = models.CharField('Год выпуска', max_length=10, blank=True)
    condition = models.CharField('Состояние', max_length=20, blank=True)
    color = models.CharField('Цвет', max_length=20, blank=True)

    # Цена и описание
    description = models.TextField('Описание', blank=True)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=2)

    # Дата создания и обновления
    created = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    # Владелец
    seller = models.ForeignKey(User, on_delete=models.CASCADE, default=1, blank=True, related_name='cars_for_sale')

    # Количество просмотров
    views_count = models.PositiveIntegerField(verbose_name='Количество просмотров', default=0)


    class Meta:
        verbose_name = 'Автомобиль'
        verbose_name_plural = 'Автомобили'

    def get_absolute_url(self):
        return f'/cars/{self.brand.slug}/{self.model.slug}/{self.id}/'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class CarPhoto(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, verbose_name='Автомобиль')
    photo = models.ImageField('Фото', upload_to='cars_photo/')

    class Meta:
        verbose_name = 'Фото автомобиля'
        verbose_name_plural = 'Фото автомобилей'

    def __str__(self) -> str:
        return f'{self.car.name} photo'

class CarLink(models.Model):
    link = models.URLField(verbose_name='Ссылка на объявление')

    def __str__(self) -> str:
        return self.link