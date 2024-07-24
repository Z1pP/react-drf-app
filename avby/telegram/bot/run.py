import os
import django
from telebot.types import Message

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'avby.settings')
django.setup()

import logging
from loader import bot
from telegram.models import TgUser

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message: Message):
    id =  message.from_user.id
    username = message.from_user.username
    user = TgUser.objects.get_or_create(tg_id=id, username=username)
    bot.reply_to(message, f"Привет {username}, как дела?")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, message.text)


if __name__ == "__main__":
    bot.infinity_polling()
