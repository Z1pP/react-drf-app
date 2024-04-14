from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, UntypedToken
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