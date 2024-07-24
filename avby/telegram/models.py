from django.db import models


class TgUser(models.Model):
    tg_id = models.PositiveIntegerField(primary_key=True, unique=True, verbose_name='Телеграм ID', blank=True)
    username = models.CharField(max_length=100, verbose_name='Имя пользователя', blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, verbose_name='Добавлен')

    class Meta:
        verbose_name = 'Пользователь телеграм'
        verbose_name_plural = 'Пользователи телеграм'

    def __str__(self) -> str:
        return self.username


class Chat(models.Model):
    user = models.ForeignKey(TgUser, on_delete=models.CASCADE, verbose_name='Пользователь')
    message = models.TextField(verbose_name='Сообщение')
    date = models.DateTimeField(auto_now_add=True, verbose_name='Дата отправки')
    is_sent = models.BooleanField(default=False, verbose_name='Отправлено')

    class Meta:
        verbose_name = 'Чат'
        verbose_name_plural = 'Чаты'