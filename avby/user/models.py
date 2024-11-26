from django.db import models
from django.contrib.auth.models import User, AbstractUser
from telegram.models import TgUser
from cars.models import Car


class CustomUser(AbstractUser):
    mail = models.EmailField(unique=True, verbose_name="Электронная почта")

    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="groups",
        blank=True,
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        related_name="custom_user_set",
        related_query_name="custom_user",
    )


class UserProfileInfo(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="Пользователь",
    )
    image = models.ImageField(
        upload_to="user_photos/",
        blank=True,
        null=True,
        verbose_name="Фото профиля",
    )
    phone = models.CharField(
        max_length=20, blank=True, null=True, verbose_name="Номер телефона"
    )
    country = models.CharField(
        max_length=50, blank=True, null=True, verbose_name="Страна"
    )
    city = models.CharField(max_length=50, blank=True, null=True, verbose_name="Город")
    telegram = models.OneToOneField(
        TgUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tg_profile",
        verbose_name="Телеграм профиль",
    )
    created = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    updated = models.DateTimeField(auto_now=True, verbose_name="Обновлен")

    class Meta:
        verbose_name = "Профиль пользователя"
        verbose_name_plural = "Профили пользователей"

    def __str__(self):
        return self.user.username


class FavoritesCars(models.Model):
    user = models.ForeignKey(
        UserProfileInfo,
        on_delete=models.CASCADE,
        related_name="favorite_cars",
        verbose_name="Пользователь",
    )
    car = models.ForeignKey(
        Car,
        on_delete=models.CASCADE,
        related_name="favorited_by_users",
        verbose_name="Машина",
    )
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "car")
        verbose_name = "Изранное"
        verbose_name_plural = "Избранные"

    def __str__(self):
        return f"{self.user.user.username} - {self.car.name}"
