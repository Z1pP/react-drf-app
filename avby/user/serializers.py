from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework import serializers, status
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
            raise serializers.ValidationError(
                detail="Пользователь с таким именем уже существует",
                code=status.HTTP_400_BAD_REQUEST,
            )
        if User.objects.filter(email=self.validated_data["email"]).exists():
            raise serializers.ValidationError(
                detail="Пользователь с таким email уже существует",
                code=status.HTTP_400_BAD_REQUEST,
            )
        user = User.objects.create_user(**self.validated_data)
        profile = UserProfileInfo.objects.create(user=user)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20, required=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    country = serializers.CharField(max_length=20, required=False, allow_blank=True)
    city = serializers.CharField(max_length=20, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "username",
            "phone",
            "country",
            "city",
        )
        read_only_fields = ("email",)

    def update(self, instance, validated_data):
        if not validated_data:
            return instance

        if not hasattr(instance, "profile"):
            UserProfileInfo.objects.create(user=instance)

        # Обновление данных пользователя
        for attr, value in validated_data.items():
            if value and hasattr(instance, attr):
                setattr(instance, attr, value)
            if value and hasattr(instance.profile, attr):
                setattr(instance.profile, attr, value)

        instance.profile.save()
        instance.save()

        return instance


class UserUpdateImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=True)

    class Meta:
        model = UserProfileInfo
        fields = ("image",)


class UserUpdatePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.instance
        if not check_password(value, user.password):
            raise serializers.ValidationError("Текущий пароль введен неверно")
        return value

    def validate(self, data):
        if data["new_password"] == data["old_password"]:
            raise serializers.ValidationError(
                {"new_password": "Новый пароль должен отличаться от текущего"}
            )

        return data

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()
        return instance


class UserFavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritesCars
        fields = "__all__"
