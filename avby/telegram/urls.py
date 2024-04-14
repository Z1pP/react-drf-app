from django.urls import path
from . import views

urlpatterns = [
    path('send_tg_message/', views.send_tg_message, name='send_tg_message'),
]