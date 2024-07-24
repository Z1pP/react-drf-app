from telebot import TeleBot
from telebot.storage import StateMemoryStorage

TOKEN = '6302381200:AAHcCUgGf2DLQyPlqsypsDS5mmr6SapmlEs'

bot = TeleBot(TOKEN, parse_mode='HTML', state_storage=StateMemoryStorage())

