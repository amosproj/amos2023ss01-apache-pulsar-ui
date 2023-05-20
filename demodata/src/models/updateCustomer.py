from pulsar import SerDe
from pulsar.schema import *

class UpdateCustomer(Record):
    publishIntervalSeconds = Integer(required=True)
    updateRandomizeMin = Integer(required=False)
    updateRandomizeMax = Integer(required=True)

class UpdateCustomerSerDe(SerDe):
    def serialize(self, input):
        CloseCustomerAvro = AvroSchema(UpdateCustomer)
        return CloseCustomerAvro.encode(input)
    def deserialize(self, input):
        CloseCustomerAvro = AvroSchema(UpdateCustomer)
        return CloseCustomerAvro.decode(input)
