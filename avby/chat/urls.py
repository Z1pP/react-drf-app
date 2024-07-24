from django.urls import path
from . import views

urlpatterns = [
    path("v1/rooms", views.RoomListView.as_view(), name="room-list"),
    path("v1/rooms/<int:pk>", views.RoomByUserIdListView.as_view(), name="room-detail"),
    path('v1/room/delete/<int:pk>', views.RoomDetailView.as_view(), name="room-delete"),
]