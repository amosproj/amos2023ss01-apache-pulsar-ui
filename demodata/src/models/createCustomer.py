from pulsar import SerDe
from pulsar.schema import *

class CreateCustomer(Record):
    numberOfPartitions = Integer(required=False)
    customerBaseMin = Integer(required=True)
    customerBaseMax = Integer(required=True)
    publishIntervalSeconds = Integer(required=True)
    maxPublishCountPerRun = Integer(required=True)
    publishRandomizeMin = Float(required=False)
    publishRandomizeMax = Float(required=False)

class CreateCustomerSerDe(SerDe):
    def serialize(self, input):
        CreateCustomerAvro = AvroSchema(CreateCustomer)
        return CreateCustomerAvro.encode(input)
    def deserialize(self, input):
        CreateCustomerAvro = AvroSchema(CreateCustomer)
        return CreateCustomerAvro.decode(input)
