from django.urls import path

from . import views

urlpatterns = [
    path("profile", views.UserDetailView.as_view(), name="profile"),
    path("register", views.UserRegisterView.as_view(), name="register"),
    path("list", views.UserListView.as_view(), name="users"),
    path(
        "favorites/<int:pk>",
        views.UserFavoritesListView.as_view(),
        name="favorites-cars",
    ),
    path("me", views.UserDetailView.as_view(), name="users-detail"),
    path("update", views.UserUpdateView.as_view(), name="user-update"),
    path(
        "update/password",
        views.UserUpdatePasswordView.as_view(),
        name="user-password-update",
    ),
]
