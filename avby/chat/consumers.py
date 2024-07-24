import json
import jwt
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.contrib.auth.models import AnonymousUser, User
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken

from .models import Room, Message

class RoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = None
        self.room_group_name = None
        self.room = None
        self.user = None

    async def connect(self):
        print('Connection...')
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        token = self.scope['query_string'].decode('utf-8').split('=')[1]
        self.user = await self.get_user_by_token(token)

        if not self.room_name or len(self.room_name) > 100:
            await self.close(code=400)
            return

        self.room_group_name = f'chat_{self.room_name}'
        self.room = await self.get_or_create_room()

        # Вход в комнату
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Добавление пользователя в список текущих пользователей комнаты
        #await self.add_online_user(self.user)
        #await self.send_user_list()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        # Удаление пользователя из списка текущих пользователей комнаты
        #await self.remove_online_user(self.user)
        #await self.send_user_list()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        message = data['message']

        if not message or len(message) > 255:
            return

        message_obj = await self.create_message(message)
        formatted_data = message_obj.created_at.strftime("%d.%m.%Y, %H:%M:%S")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message_obj.text,
                'user_id': message_obj.user.id,
                "username": message_obj.user.username,
                "created_at": formatted_data,
            },
        )

    # async def send_user_list(self):
    #     user_list = await self.get_connected_users()
    #     await self.channel_layer.group_send(
    #         self.room_group_name,
    #         {
    #             "type": "user_list",
    #             "user_list": user_list,
    #         },
    #     )

    async def chat_message(self, event):
        message = event["message"]
        username = event["username"]
        user_id = event["user_id"]
        created_at = event["created_at"]
        await self.send(
            text_data=json.dumps(
                {"message": message, "username": username, "user_id": user_id, "created_at": created_at}
            )
        )

    async def user_list(self, event):
        user_list = event["user_list"]
        await self.send(text_data=json.dumps({"user_list": user_list}))

    @database_sync_to_async
    def create_message(self, message):
        try:
            return Message.objects.create(
                room=self.room,
                user=self.user,
                text=message
            )
        except Exception as ex:
            print(f'Ошибка создания сообщения {ex}')
            return None

    @database_sync_to_async
    def get_or_create_room(self):
        room, _ = Room.objects.get_or_create(name=self.room_name)
        return room

    # @database_sync_to_async
    # def add_online_user(self, user):
    #     try:
    #         if user.is_authenticated:
    #             self.room.current_users.add(user)
    #             self.room.save()
    #     except Exception as e:
    #         print("Error joining user to room:", str(e))
    #         return None
    #
    # @database_sync_to_async
    # def remove_online_user(self, user):
    #     try:
    #         if user.is_authenticated:
    #             self.room.current_users.remove(user)
    #             self.room.save()
    #     except Exception as e:
    #         print("Error removing user from room:", str(e))
    #         return None

    # @database_sync_to_async
    # def get_connected_users(self):
    #     return [user.username for user in self.room.current_users.all()]

    @database_sync_to_async
    def get_user_by_token(self, token):
        try:
            UntypedToken(token)
            decoded_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = decoded_data.get('user_id')
            user = User.objects.get(id=user_id)
            return user
        except (InvalidToken, TokenError, User.DoesNotExist):
            return AnonymousUser()