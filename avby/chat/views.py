from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.db.models import Q

from .models import Room
from .serializers import RoomSerializer

class RoomListView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = (AllowAny,)


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = (AllowAny,)

class RoomByUserIdListView(generics.ListAPIView):
    serializer_class = RoomSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        user_id = self.kwargs.get('pk')
        return Room.objects.filter(Q(current_users__id=user_id)).distinct()
