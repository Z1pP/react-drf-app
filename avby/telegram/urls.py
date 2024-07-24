from django.urls import path
from . import views

urlpatterns = [
    path('send_tg_message/', views.send_tg_message, name='send_tg_message'),
    path('v1/telegram/delete/<int:tg_id>', views.DeleteTgProfileView.as_view(), name='delete_tg_profile'),
]