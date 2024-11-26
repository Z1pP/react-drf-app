from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from user.models import User


class UserLoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_id = User.objects.get(username=user.username).id
        token["user_id"] = user_id
        return token
