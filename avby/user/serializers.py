from django.contrib.auth.models import User
from django.contrib.staticfiles import finders
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer

from telegram.models import TgUser
from .models import UserProfileInfo


class TelegramProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TgUser
        fields = ('tg_id','username')

class UserProfileSerializer(serializers.ModelSerializer):
    telegram = TelegramProfileSerializer()
    class Meta:
        model = UserProfileInfo
        fields = ('phone','country','city','telegram_attached','telegram','image')
class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'profile',]
        read_only_fields = ('id', 'created_at', 'updated_at')

class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def save(self):
        if User.objects.filter(username=self.validated_data['username']).exists():
            return None
        user = User.objects.create_user(**self.validated_data)
        profile = UserProfileInfo.objects.create(user=user)
        return profile


class UserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_id = User.objects.get(username=user.username).id
        token['user_id'] = user_id
        return token

class UserUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="profile.phone", allow_null=True, required=False)
    country = serializers.CharField(source="profile.country", allow_null=True, required=False)
    city = serializers.CharField(source="profile.city", allow_null=True, required=False)
    image = serializers.ImageField(source="profile.image", allow_null=True, required=False, default='user_photos/user-noimage.webp')
    password = serializers.CharField(write_only=True, allow_null=True, required=False, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'country', 'city', 'image', 'password')

    def update(self, instance, validated_data):
        # Обновление пароля
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        # Обновление данных профиля
        for attr, value in validated_data.items():
            if attr in self.Meta.fields:
                setattr(instance, attr, value)

        profile_data = validated_data.pop('profile', {})
        for attr, value in profile_data.items():
            setattr(instance.profile, attr, value)

        instance.save()
        instance.profile.save()

        return instance

    def partial_update(self, instance, validated_data):
        return self.update(instance, validated_data, partial=True)