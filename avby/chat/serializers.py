from .models import Room, Message
from user.serializers import UserSerializer
from rest_framework import serializers

class MessageSerializer(serializers.ModelSerializer):
    created_at_formatted = serializers.SerializerMethodField()
    user = UserSerializer()

    class Meta:
        model = Message
        exclude = []

    def get_created_at_formatted(self, obj: Message):
        return obj.created_at.strftime("%d.%m.%Y, %H:%M:%S")

class RoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Room
        fields = ["pk", "name", "messages", "current_users", "last_message"]
        read_only_fields = ["messages", "last_message"]

    def get_last_message(self, obj: Room):
        last_message = obj.messages.order_by('created_at').last()
        return MessageSerializer(last_message).data if last_message else None