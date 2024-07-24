from django.contrib.auth.models import User
from django.utils.text import slugify
from rest_framework import serializers
from rest_framework.fields import empty

from .models import Car, CarPhoto, CarBrand, CarModel


class CarSellerSerializer(serializers.HyperlinkedModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    country = serializers.CharField(source='profile.country', read_only=True)
    city = serializers.CharField(source='profile.city', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'image', 'phone', 'country', 'city')


class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ('id', 'photo')


class CarBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarBrand
        fields = ('name', 'slug')


class CarModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarModel
        fields = ('name', 'slug')


class CarSerializer(serializers.ModelSerializer):
    brand = CarBrandSerializer(required=False)
    model = CarModelSerializer(required=False)
    photos = CarPhotoSerializer(source='carphoto_set', many=True)
    seller = CarSellerSerializer(required=False)

    class Meta:
        model = Car
        fields = ('__all__')


class CarCreateSerializer(serializers.ModelSerializer):
    brand = serializers.CharField(source='brand.name')
    model = serializers.CharField(source='model.name')
    photos = serializers.ListField(source='carphoto_set', child=serializers.ImageField())
    seller = serializers.CharField(source='seller.id')

    class Meta:
        model = Car
        fields = ('brand', 'model', 'photos', 'seller', 'name', 'engine_capacity', 'fuel_type', 'drive_type',
                  'transmission_type', 'car_body', 'milage', 'year', 'condition', 'color', 'description', 'price')

    def create(self, validated_data):
        photos = validated_data.pop('carphoto_set')
        brand_name = validated_data.pop('brand')['name']
        model_name = validated_data.pop('model')['name']
        seller_id = validated_data.pop('seller')['id']

        brand_obj, _ = CarBrand.objects.get_or_create(name=brand_name)
        model_obj, _ = CarModel.objects.get_or_create(name=model_name, car_brand_id=brand_obj.id)
        seller_obj = User.objects.get(id=seller_id)

        car = Car.objects.create(brand=brand_obj, model=model_obj, seller=seller_obj, **validated_data)

        for photo in photos:
            CarPhoto.objects.create(car=car, photo=photo)

        return car
