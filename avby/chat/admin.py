from django.contrib import admin
from .models import Room, Message

# Register your models here.
@admin.register(Room)
class RoomModelAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Message)
class MessageModelAdmin(admin.ModelAdmin):
    list_display = ('room', 'text', 'user')
    ordering = ['created_at']