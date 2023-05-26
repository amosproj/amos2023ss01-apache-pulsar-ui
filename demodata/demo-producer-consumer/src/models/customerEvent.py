from pulsar import SerDe
from pulsar.schema import *

class CustomerEvent(Record):
    customerId = String(required=True)
    firstName = String(required=True)
    lastName = String(required=True)
    title = String(required=False)
    placeOfBirth = String(required=True)
    countryOfBirth = String(required=True)
    dateOfBirth = String(required=True)
    dateOfOpened = String(required=True)
    dateOfClosed = String(required=False)
    bic = String(required=False)
    lineOfBusiness = String(required=True)
    status = String(required=True)

class CustomerEventSerDe(SerDe):
    def serialize(self, input):
        CustomerEventAvro = AvroSchema(CustomerEvent)
        return CustomerEventAvro.encode(input)
    def deserialize(self, input):
        CustomerEventAvro = AvroSchema(CustomerEvent)
        return CustomerEventAvro.decode(input)
