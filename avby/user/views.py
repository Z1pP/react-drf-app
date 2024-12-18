from django.contrib.auth.models import User
from rest_framework import generics, status, views
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import FavoritesCars

from .serializers import (
    UserSerializer,
    UserRegisterSerializer,
    UserUpdateSerializer,
    UserFavoritesSerializer,
    UserUpdatePasswordSerializer,
    UserUpdateImageSerializer,
)


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(views.APIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserDetailView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """
        Return the user details information
        """
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateView(views.APIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def patch(self, request, *args, **kwargs):
        data = request.data
        instance = request.user
        serializer = self.serializer_class(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdatePasswordView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserUpdatePasswordSerializer
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, *args, **kwargs):
        data = request.data
        instance = request.user
        serializer = self.serializer_class(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateImageView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserUpdateImageSerializer

    def put(self, request, *args, **kwargs):
        if "image" not in request.FILES:
            return Response(
                data={"error": "No image file provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        instance = request.user.profile
        serializer = self.serializer_class(instance, data=request.FILES, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserFavoritesListView(generics.ListAPIView):
    queryset = FavoritesCars.objects.all()
    serializer_class = UserFavoritesSerializer
    permission_classes = (permissions.IsAuthenticated,)
