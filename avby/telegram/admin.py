from django.contrib import admin
from .actions import send_message_to_users2
from .models import TgUser, Chat


# Register your models here.
@admin.register(TgUser)
class TgUserAdmin(admin.ModelAdmin):
    list_display = ('tg_id', 'username','created')
    search_fields = ('username',)
    list_filter = ('created',)
    date_hierarchy = 'created'
    actions = [send_message_to_users2]


@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'date', 'is_sent')
    search_fields = ('message',)
    list_filter = ('date', 'is_sent')


