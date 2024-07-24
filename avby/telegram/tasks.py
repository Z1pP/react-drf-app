import schedule
import time
from threading import Thread

from .bot.loader import bot
from .models import Chat


def send_postpone_message(user, text, send_time):
    try:
        schedule.every().day.at(send_time.strftime('%H:%M')).do(send_message, user=user, text=text)
    except Exception as e:
        print(f'Ошибка при планировании задачи: {e}')


def send_message(user: dict, text: str):
    user_id = user['tg_id']
    username = user['username']
    text = f"Пользователь @{username}: {text}"
    try:
        bot.send_message(chat_id=user_id, text=text)
        chat = Chat(message=text, is_sent=True, user_id=user_id)
    except Exception as e:
        chat = Chat(message=text, is_sent=False, user_id=user_id)
        print(f'Ошибка при создании модели Chat: {e}')
    finally:
        chat.save()


def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(1)


def start_scheduler():
    scheduler_thread = Thread(target=run_scheduler)
    scheduler_thread.start()