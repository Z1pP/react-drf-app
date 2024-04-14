

from django.contrib import admin, messages
from django.urls import reverse
from django.http import HttpResponseRedirect

@admin.action(description="Отправить сообщение пользователям")
def send_message_to_users2(modeladmin, request, queryset):
    selected_items = queryset.values()
    users = [
        {
            'tg_id': item['tg_id'],
            'username': item['username'],
        } for item in selected_items
    ]
    request.session['users'] = users
    messages.success(request, "Пользователи добавлены в очередь на отправку сообщения.")
    return HttpResponseRedirect(reverse('send_tg_message'))