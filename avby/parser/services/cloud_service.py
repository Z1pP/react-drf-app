import os
import dropbox
from dotenv import load_dotenv
from abc import ABC, abstractmethod

load_dotenv()
class CloudService(ABC):
    @abstractmethod
    def upload_file(self, file):
        pass

    @abstractmethod
    def download_file(self, file):
        pass

    @abstractmethod
    def connect_to_cloud(self, token, secret_app, key_app):
        pass
class DropBoxService(CloudService):
    def __init__(self, token: str, app_secret: str = None, app_key: str = None):
        self.dbx = self.connect_to_cloud(token, app_secret, app_key)

    def connect_to_cloud(self, token, app_secret, app_key):
        try:
            return dropbox.Dropbox(token, app_secret=app_secret, app_key=app_key)
        except Exception as e:
            print('Error connecting to cloud: ', e)
            return None

    def upload_file(self, file):
        pass

    def download_file(self, file):
        pass