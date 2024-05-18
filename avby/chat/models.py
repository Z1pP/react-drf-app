from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True, verbose_name='Название комнаты')
    current_users = models.ManyToManyField(to=User, related_name='current_rooms', blank=True,
                                           verbose_name='Текущие пользователи')

    def __str__(self):
        return f"Комната {self.name}"

class Message(models.Model):
    room = models.ForeignKey('chat.Room', on_delete=models.CASCADE, related_name='messages',
                             verbose_name='Комната')
    text = models.TextField(null=True, blank=True, verbose_name='Сообщение')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='messages')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Сообщение ({self.user} {self.room})'