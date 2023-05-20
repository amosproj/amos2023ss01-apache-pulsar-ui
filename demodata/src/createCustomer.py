import os
import threading
import random
import time
from pathlib import Path
from datetime import datetime, timedelta
from faker import Faker

import pulsar
from pulsar.schema import *
from pulsar import ConsumerType
from models import PulsarClientProperties, MessageProperties, CreateCustomer, CustomerEvent

### CONFIG from ENV ###
# Neuron
# export PULSAR_URL='pulsar://localhost:6650'
PULSAR_URL = os.getenv('PULSAR_URL')
if PULSAR_URL is None:
    print('$PULSAR_URL missing')
    exit(1)

# State file
STATE_FILE_PATH = os.getenv('STATE_FILE_PATH', default='/tmp/customer.state')

# Topics
CREATE_CUSTOMER_TOPIC_PRODUCE = os.getenv('CREATE_CUSTOMER_TOPIC_PRODUCE', default='persistent://neuron-demo/customer/command.create-customer.v1')
CREATE_CUSTOMER_TOPIC_CONSUME = os.getenv('CREATE_CUSTOMER_TOPIC_CONSUME', default=CREATE_CUSTOMER_TOPIC_PRODUCE)
CUSTOMER_TOPIC = os.getenv('CUSTOMER_TOPIC', default='persistent://rbi-demo/customer/event.neuron-demo-customer.v1')
#CUSTOMER_TOPIC = os.getenv('CUSTOMER_TOPIC', default='persistent://neuron-demo/customer/event.customer.v1')

# Producer settings
PULSAR_CLIENT_NAME = os.getenv('PULSAR_CLIENT_NAME', default='tech-rbi-neuron-demo-create-customer')

# Business settings
CUSTOMER_BASE_MIN = os.getenv('CUSTOMER_BASE_MIN', default='500000')
CUSTOMER_BASE_MAX = os.getenv('CUSTOMER_BASE_MAX', default='1000000')

PUBLISH_INTERVAL_SECONDS = os.getenv('PUBLISH_INTERVAL_SECONDS', default='5')
MAX_PUBLISH_COUNT_PER_RUN = os.getenv('MAX_PUBLISH_COUNT_PER_RUN', default='5')
PUBLISH_RANDOMIZE_MIN = os.getenv('PUBLISH_RANDOMIZE_MIN', default='1.0')
PUBLISH_RANDOMIZE_MAX = os.getenv('PUBLISH_RANDOMIZE_MAX', default='1.0')

def fake_customer ():
    event_customercreated_content = CustomerEvent(customerId = fake.bothify(text='##########')
                                                  , firstName = fake['de_AT'].first_name()
                                                  , lastName = fake['de_AT'].last_name()
                                                  , title = fake['de_AT'].prefix()
                                                  , placeOfBirth = fake['de_AT'].city()
                                                  , countryOfBirth = fake['de_AT'].country_code()
                                                  , dateOfBirth = fake.date_of_birth(maximum_age=90, minimum_age=10).strftime('%Y-%m-%d')
                                                  , dateOfOpened = fake.date_between_dates(date_start=datetime.fromisoformat('2000-01-01'), date_end=datetime.today()).strftime('%Y-%m-%d')
                                                  , bic = ''
                                                  , lineOfBusiness = 'PI'
                                                  , status = 'Open')
    return event_customercreated_content

def publish_command_createcustomer (content):
    # Hint: Have a look at class MessageProperties and "deliver_after" functionality
    producer_create_customer.send(content=content, properties=vars(MessageProperties(message_name='CreateCustomer')), deliver_after=timedelta(seconds=content.publishIntervalSeconds))

def publish_event_customercreated (create_customer, correlation_id, causation_id):
    if numberOfCustomers < create_customer.customerBaseMin:
        number_of_customers_to_create=create_customer.maxPublishCountPerRun
    elif numberOfCustomers < create_customer.customerBaseMax:
        factor=random.randint(create_customer.publishRandomizeMin*100,create_customer.publishRandomizeMax*100)/100
        number_of_customers_to_create=int(create_customer.maxPublishCountPerRun*factor)
    else:
        number_of_customers_to_create=0
    print (f'Info: Creating {number_of_customers_to_create} CustomerCreate event(s) based on customer base of {numberOfCustomers} and parameters')
    for x in range(number_of_customers_to_create):
        content = fake_customer()
        # Hint: Have a look at class MessageProperties, partition_key and event_timestamp
        producer_customer_created.send_async(content=content, partition_key=content.customerId, properties=vars(MessageProperties(message_name='CustomerCreated', correlation_id=correlation_id, causation_id=causation_id)), event_timestamp=int(time.time() * 1000), callback=None)
    producer_customer_created.flush()

def consume_command_createcustomer ():
  consumer_create_customer = client.subscribe(topic=CREATE_CUSTOMER_TOPIC_CONSUME, schema=AvroSchema(CreateCustomer), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Shared)

  while True:
    message = consumer_create_customer.receive()
    properties = message.properties()
    if properties['messageName'] == 'CreateCustomer':
        publish_event_customercreated(create_customer=message.value(), correlation_id=properties['correlationId'], causation_id=properties['causationId'])
        publish_command_createcustomer(message.value())
    consumer_create_customer.acknowledge(message)

def consume_event_customer ():
  consumer_customer = client.subscribe(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Exclusive)

  while True:
    global numberOfCustomers
    message = consumer_customer.receive()
    properties = message.properties()
    if properties['messageName'] == 'CustomerCreated':
        numberOfCustomers += 1
        print (f'Info: "{properties["messageName"]}" increased number of customer to: {numberOfCustomers}')
    elif properties['messageName'] == 'CustomerClosed':
        numberOfCustomers -= 1
        print (f'Info: "{properties["messageName"]}" decreased number of customer to: {numberOfCustomers}')
    elif properties['messageName'] == 'CustomerOpened':
        numberOfCustomers += 1
        print (f'Info: "{properties["messageName"]}" increased number of customer to: {numberOfCustomers}')
    file = open ( STATE_FILE_PATH,'w')
    file.write(str(numberOfCustomers))
    file.close()
    consumer_customer.acknowledge(message)

### main ###

# Faker setup
locales = ['de_AT', 'en_US']
fake = Faker(locales)
Faker.seed(random.seed())

# Pulsar client setup
client = pulsar.Client(PULSAR_URL)
client_properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron'))
# Hint: Using batching type "key based" will enable key based shared subscriptions for sharding / scaling.
producer_create_customer = client.create_producer(topic=CREATE_CUSTOMER_TOPIC_PRODUCE, schema=AvroSchema(CreateCustomer), producer_name=PULSAR_CLIENT_NAME, properties= client_properties, batching_type=pulsar.BatchingType.KeyBased)
producer_customer_created = client.create_producer(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), producer_name=PULSAR_CLIENT_NAME, properties= client_properties)

# Init and customer creation
random.seed()
path = Path(STATE_FILE_PATH)
path.touch(exist_ok=True)
file = open (path,'r+')
state_from_file = file.readline()
if state_from_file == '':
    numberOfCustomers=0
    file.write(str(numberOfCustomers))
    # Init by publishing first CreateCustomer command message!
    command_createcustomer_content = CreateCustomer(customerBaseMin = int(CUSTOMER_BASE_MIN)
                                                , customerBaseMax = int(CUSTOMER_BASE_MAX)
                                                , publishIntervalSeconds = int(PUBLISH_INTERVAL_SECONDS)
                                                , maxPublishCountPerRun = int(MAX_PUBLISH_COUNT_PER_RUN)
                                                , publishRandomizeMin = float(PUBLISH_RANDOMIZE_MIN)
                                                , publishRandomizeMax = float(PUBLISH_RANDOMIZE_MAX))    
    publish_command_createcustomer(command_createcustomer_content)
    print ('Info: Starting init with numberOfCustomers=0 and sended CreateCustomer command message')
else:    
    numberOfCustomers=int(state_from_file)
    print (f'Info: Starting state from file numberOfCustomers: {numberOfCustomers}')
file.close()

# Created threaded consumers
consume_create_customer = threading.Thread(target=consume_command_createcustomer)
consume_create_customer.daemon = True
consume_create_customer.start()
consume_customer = threading.Thread(target=consume_event_customer)
consume_customer.daemon = True
consume_customer.start()

while True:
    time.sleep(1)

client.close()
