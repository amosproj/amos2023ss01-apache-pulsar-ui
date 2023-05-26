import json

class PulsarClientProperties:
    def __init__(self, name, email, url=None):
        self.name = name
        self.email = email
        if url is not None:
            self.url = url
