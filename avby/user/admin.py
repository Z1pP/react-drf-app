from django.contrib import admin
from .models import UserProfileInfo, FavoritesCars


# Register your models here.
class FavoriteCarInline(admin.TabularInline):
    model = FavoritesCars
    extra = 1


@admin.register(FavoritesCars)
class FavoriteCarsAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "car")
    list_filter = ("created",)


@admin.register(UserProfileInfo)
class UserProfileInfoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "phone",
        "country",
        "city",
        "created",
    )
    list_display_links = (
        "id",
        "user",
    )
    search_fields = ("user", "country", "city")
    list_filter = ("created",)
    list_per_page = 20
    ordering = ("-created",)
    list_editable = ("phone",)
    inlines = [FavoriteCarInline]
