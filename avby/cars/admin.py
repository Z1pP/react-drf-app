from django.contrib import admin

from .models import Car, CarPhoto, CarBrand, CarModel, CarLink

@admin.register(CarLink)
class CarLinkAdmin(admin.ModelAdmin):
    list_display = ("id", "link")
    ordering = ["link"]

@admin.register(CarBrand)
class CarBrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    ordering = ["name"]
    prepopulated_fields = {"slug": ("name",)}

@admin.register(CarModel)
class AdminCarModel(admin.ModelAdmin):
    list_display = ("id", "name", "car_brand")
    ordering = ["name"]
    prepopulated_fields = {"slug": ("name",)}


class CarPhotoInline(admin.TabularInline):
    model = CarPhoto

class CarAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "year", "price", "created")
    ordering = ["-price", "year", "created"]
    search_fields = ["name", "year", "price"]
    list_filter = ["year", "price"]
    list_per_page = 10
    inlines = [CarPhotoInline]
    prepopulated_fields = {"slug": ("name",)}

admin.site.register(Car, CarAdmin)
