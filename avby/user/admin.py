from django.contrib import admin
from .models import UserProfileInfo

# Register your models here.
@admin.register(UserProfileInfo)
class UserProfileInfoAdmin(admin.ModelAdmin):
    list_display = ('id','user','phone','country','city','created',)
    list_display_links = ('id', 'user',)
    search_fields = ('user','country','city')
    list_filter = ('created',)
    list_per_page = 20
    ordering = ('-created',)
    list_editable = ('phone',)
