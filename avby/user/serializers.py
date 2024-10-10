from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from telegram.models import TgUser
from .models import UserProfileInfo, FavoritesCars


class TelegramProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TgUser
        fields = ("tg_id", "username")


class UserProfileSerializer(serializers.ModelSerializer):
    telegram = TelegramProfileSerializer(required=False)

    class Meta:
        model = UserProfileInfo
        fields = ("phone", "country", "city", "telegram", "image")


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "password",
            "profile",
        ]
        read_only_fields = ("id", "created_at", "updated_at")


class UserRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def save(self):
        if User.objects.filter(username=self.validated_data["username"]).exists():
            raise serializers.ValidationError("User with this username already exists")
        if User.objects.filter(email=self.validated_data["email"]).exists():
            raise serializers.ValidationError("User with this email already exists")
        user = User.objects.create_user(**self.validated_data)
        profile = UserProfileInfo.objects.create(user=user)
        return user


class UserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_id = User.objects.get(username=user.username).id
        token["user_id"] = user_id
        return token


class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20, required=True)
    email = serializers.EmailField(required=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=20, required=False, allow_blank=True)
    city = serializers.CharField(max_length=20, required=False, allow_blank=True)
    image = serializers.ImageField(required=False)
    password = serializers.CharField(
        write_only=True,
        allow_blank=True,
        required=False,
        style={"input_type": "password"},
    )
    password2 = serializers.CharField(
        write_only=True,
        allow_blank=True,
        required=False,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "phone",
            "country",
            "image",
            "city",
            "password",
            "password2",
        )

    def update(self, instance, validated_data):
        if not validated_data:
            return instance

        # Обновление пароля
        old_password = validated_data.pop("password", None)
        new_password = validated_data.pop("password2", None)

        if old_password and new_password:
            if check_password(old_password, instance.password):
                instance.set_password(new_password)
            else:
                raise serializers.ValidationError(
                    {"password": "Старый пароль не корректен"}
                )

        # Обновление данных пользователя
        for attr, value in validated_data.items():
            if value and hasattr(instance, attr):
                setattr(instance, attr, value)
            if value and hasattr(instance.profile, attr):
                setattr(instance.profile, attr, value)

        instance.profile.save()
        instance.save()

        return instance

    def partial_update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", None)
        if profile_data:
            nested_serializer = self.fields["profile"]
            nested_instance = instance.profile
            nested_serializer.update(nested_instance, profile_data)

        return super().update(instance, validated_data)


class UserFavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritesCars
        fields = "__all__"
