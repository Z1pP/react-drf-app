from django.urls import path
from . import views

urlpatterns = [
    path("rooms", views.RoomListView.as_view(), name="room-list"),
    path("rooms/<int:pk>", views.RoomByUserIdListView.as_view(), name="room-detail"),
    path("room/delete/<int:pk>", views.RoomDetailView.as_view(), name="room-delete"),
]
