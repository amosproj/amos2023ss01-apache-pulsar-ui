from pulsar import SerDe
from pulsar.schema import *

class CloseCustomer(Record):
    publishIntervalSeconds = Integer(required=True)
    closeRandomizeMin = Integer(required=False)
    closeRandomizeMax = Integer(required=True)

class CloseCustomerSerDe(SerDe):
    def serialize(self, input):
        CloseCustomerAvro = AvroSchema(CloseCustomer)
        return CloseCustomerAvro.encode(input)
    def deserialize(self, input):
        CloseCustomerAvro = AvroSchema(CloseCustomer)
        return CloseCustomerAvro.decode(input)
