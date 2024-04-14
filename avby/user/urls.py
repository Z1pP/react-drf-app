from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

from . import views

urlpatterns = [
    path('v1/users/profile', views.UserDetailView.as_view(), name='profile'),
    path('v1/users/register',
         views.UserRegisterView.as_view(),
         name='register'),
    path('v1/users',
         views.UserListView.as_view(),
         name='users'),
    path('v1/users/<int:pk>',
         views.UserDetailView.as_view(),
         name='users-detail'),
    # JWT route
    path('v1/token/', views.UserLoginView.as_view(), name='token_obtain_pair'),
    path('v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('v1/token/verify', TokenVerifyView.as_view(), name='token_verify'),
]