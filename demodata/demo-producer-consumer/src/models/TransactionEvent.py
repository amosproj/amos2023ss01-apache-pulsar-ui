from pulsar import SerDe
from pulsar.schema import *

class TransactionEvent(Record):
    amount = String(required=True)
    timestamp = String(required=True)
    customerId = String(required=True)
    transactionType = String(required=False)

class TransactionEventSerDe(SerDe):
    def serialize(self, input):
        TransactionEventAvro = AvroSchema(TransactionEvent)
        return TransactionEventAvro.encode(input)
    def deserialize(self, input):
        TransactionEventAvro = AvroSchema(TransactionEvent)
        return TransactionEventAvro.decode(input)
