"""
ASGI config for avby project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import django
import uvicorn

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'avby.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing


application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    )
})

if __name__ == "__main__":
    uvicorn.run("avby.asgi:application", port=8080, reload=True)