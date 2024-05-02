from django.contrib import messages
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.urls import reverse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .forms import FormSendMessage
from .tasks import start_scheduler, send_postpone_message, send_message
from .models import TgUser



# Create your views here.
@staff_member_required()
def send_tg_message(request):
    if request.method == "POST":
        form = FormSendMessage(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            users = request.session.get('users')
            try:
                # Обработка отложенного сообщения
                if data['postpone']:
                    if not data['send_time']:
                        messages.error(request, "Пожалуйста, укажите время для отправки отложенного сообщения.")
                        return HttpResponseRedirect(reverse('admin:telegram_tguser_changelist'))
                    send_time = data['send_time']
                    for user in users:
                        send_postpone_message(user, data['message'], send_time)
                    start_scheduler() # Запускаем отдельный поток для отложенного вызова
                    messages.success(request, f"Отложенные сообщения запланированы на {send_time.strftime('%H:%M')}.")
                else:
                    # обработка моментального сообщения
                    for user in users:
                        send_message(user, data['message'])
                    messages.success(request, "Сообщения успешно отправлены.")
            except Exception as e:
                messages.error(request, "Ошибка при отправке сообщений.")
        # Очистка сессии
        request.session['users'] = None
        return HttpResponseRedirect(reverse('admin:telegram_tguser_changelist'))
    else:
        form = FormSendMessage()
    return render(request, 'admin/send_message.html', {'form': form})


class DeleteTgProfileView(generics.DestroyAPIView):
    permission_classes = (AllowAny,)
    def delete(self, request, *args, **kwargs):
        tg_id = self.kwargs.get('tg_id')
        message = "Ваш профиль успешно удален!"
        try:
            user = TgUser.objects.get(tg_id=tg_id)
            send_message(user.__dict__, message)
            user.delete()
            return Response({"message": "Телеграм профиль удален"},status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)



