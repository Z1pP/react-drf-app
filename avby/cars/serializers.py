from django.contrib.auth.models import User
from django.utils.text import slugify
from rest_framework import serializers
from .models import Car, CarPhoto, CarBrand, CarModel


class CarSellerSerializer(serializers.HyperlinkedModelSerializer):
    image = serializers.ImageField(source='profile.image', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    country = serializers.CharField(source='profile.country', read_only=True)
    city = serializers.CharField(source='profile.city', read_only=True)

    class Meta:
        model = User
        fields = ('id','username','image','phone','country','city')



class CarPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarPhoto
        fields = ('id','photo')


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
    photos = CarPhotoSerializer(source='carphoto_set', many=True, required=False)
    seller = CarSellerSerializer(required=False)

    class Meta:
        model = Car
        fields = ('__all__')


    def is_valid(self, *, raise_exception=False):
        self._validate_unique = False
        data = self.initial_data
        brand = data.get('brand')
        model = data.get('model')
        brand, _ = CarBrand.objects.get_or_create(name=brand, slug=slugify(brand))
        model, _ = CarModel.objects.get_or_create(name=model, slug=slugify(model))


        return super().is_valid(raise_exception=raise_exception)