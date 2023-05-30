import json
import uuid

class MessageProperties:
    def __init__(self, message_name, id=str(uuid.uuid4()), correlation_id=str(uuid.uuid4()), causation_id='00000000-0000-0000-0000-000000000000', message_key=None, message_type=None):
        if message_key is not None:
            self.messageKey = message_key
        if message_type is not None:
            self.messageType = message_type
        self.messageName=message_name
        self.id=id
        self.correlationId=correlation_id
        self.causationId=causation_id
