from django.db import models
from django.contrib.auth.models import User
from telegram.models import TgUser


# Create your models here.
class UserProfileInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', verbose_name='Пользователь')
    image = models.ImageField(upload_to='user_photos/', blank=True, null=True, default='user_photos/user-noimage.webp',
                              verbose_name='Фото профиля')
    phone = models.CharField(max_length=20, blank=True, null=True,
                             verbose_name='Номер телефона')
    country = models.CharField(max_length=50, blank=True, null=True,
                               verbose_name='Страна')
    city = models.CharField(max_length=50, blank=True, null=True,
                            verbose_name='Город')
    telegram_attached = models.BooleanField(default=False,
                                            verbose_name='Привязан телеграм')
    telegram = models.OneToOneField(TgUser, on_delete=models.CASCADE, null=True, blank=True, related_name='tg_profile',
                                    verbose_name='Телеграм идентификатор')
    created = models.DateTimeField(auto_now_add=True,
                                   verbose_name='Создан')
    updated = models.DateTimeField(auto_now=True, verbose_name='Обновлен')

    class Meta:
        verbose_name = 'Профиль пользователя'
        verbose_name_plural = 'Профили пользователей'
    def __str__(self):
        return self.user.username