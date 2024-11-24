from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializer import UserLoginSerializer


class UserLoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer
