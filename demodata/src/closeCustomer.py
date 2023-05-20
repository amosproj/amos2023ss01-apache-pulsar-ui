import os
import threading
import random
import time
from pathlib import Path
from datetime import datetime, timedelta

import pulsar
from pulsar.schema import *
from pulsar import ConsumerType
from models import PulsarClientProperties, MessageProperties, CloseCustomer, CustomerEvent

### CONFIG from ENV ###
# Neuron
# export PULSAR_URL='pulsar://localhost:6650'
PULSAR_URL = os.getenv('PULSAR_URL')
if PULSAR_URL is None:
    print('$PULSAR_URL missing')
    exit(1)

# Topics
CLOSE_CUSTOMER_TOPIC_PRODUCE = os.getenv('CLOSE_CUSTOMER_TOPIC_PRODUCE', default='persistent://neuron-demo/customer/command.close-customer.v1')
CLOSE_CUSTOMER_TOPIC_CONSUME = os.getenv('CLOSE_CUSTOMER_TOPIC_CONSUME', CLOSE_CUSTOMER_TOPIC_PRODUCE)
CUSTOMER_TOPIC = os.getenv('CUSTOMER_TOPIC', default='persistent://rbi-demo/customer/event.neuron-demo-customer.v1')

# Producer settings
PULSAR_CLIENT_NAME = os.getenv('PULSAR_CLIENT_NAME', default='tech-rbi-neuron-demo-close-customer')

# Business settings
PUBLISH_INTERVAL_SECONDS = os.getenv('PUBLISH_INTERVAL_SECONDS', default='15')

CLOSE_RANDOMIZE_MIN = os.getenv('CLOSE_RANDOMIZE_MIN', default='1')
CLOSE_RANDOMIZE_MAX = os.getenv('CLOSE_RANDOMIZE_MAX', default='2')

def publish_command_closecustomer (content):
    # Hint: Have a look at class MessageProperties and "deliver_after" functionality
    producer_close_customer.send(content=content, properties=vars(MessageProperties(message_name='CloseCustomer')), deliver_after=timedelta(seconds=content.publishIntervalSeconds))

def publish_event_customerclosed (close_customer, correlation_id, causation_id):
    number_of_customers_to_close=random.randint(close_customer.closeRandomizeMin,close_customer.closeRandomizeMax)

    if len(open_customers) < number_of_customers_to_close:
        number_of_customers_to_close = len(open_customers)
    print (f'Info: Open customer(s) known in dict: {len(open_customers)} => Send {number_of_customers_to_close} CustomerClosed event(s) based on parameters.')
    keys_to_close=[]
    while len(keys_to_close) < number_of_customers_to_close:
        random_id = random.choice(list(open_customers.keys()))
        if random_id not in keys_to_close:
            keys_to_close.append(random_id)
    for id in keys_to_close:
        customer = open_customers[id]
        customer.dateOfClosed = time.strftime('%Y-%m-%d')
        customer.status = 'Closed'
        # Hint: Have a look at class MessageProperties, partition_key and event_timestamp
        producer_customer_closed.send(content=customer, partition_key=customer.customerId, properties=vars(MessageProperties(message_name='CustomerClosed', correlation_id=correlation_id, causation_id=causation_id)), event_timestamp=int(time.time() * 1000))
        print (f'Info: Closing customer: {customer.customerId}. CustomerClosed event send.')

            

def consume_command_closecustomer ():
  consumer_close_customer = client.subscribe(topic=CLOSE_CUSTOMER_TOPIC_CONSUME, schema=AvroSchema(CloseCustomer), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Shared)

  while True:
    message = consumer_close_customer.receive()
    properties = message.properties()
    if properties['messageName'] == 'CloseCustomer':
        publish_event_customerclosed(close_customer=message.value(), correlation_id=properties['correlationId'], causation_id=properties['causationId'])
        publish_command_closecustomer(message.value())
    consumer_close_customer.acknowledge(message)

def consume_event_customer ():
  consumer_customer = client.subscribe(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Exclusive)

  while True:
    global open_customers
    message = consumer_customer.receive()
    content = message.value()
    properties = message.properties()
    value= message.value()
    if properties['messageName'] in ('CustomerCreated','CustomerUpdated','CustomerOpened'):
        open_customers[content.customerId]=content
        print (f'Info: Added customer "{content.customerId}" to ephemeral state because of {properties["messageName"]}.')
    elif properties['messageName'] == 'CustomerClosed':
        open_customers.pop(content.customerId, None)
        print (f'Info: Removed customer "{content.customerId}" from ephemeral state because of {properties["messageName"]}.')
    consumer_customer.acknowledge(message)

### main ###
random.seed()

# Pulsar client setup
client = pulsar.Client(PULSAR_URL)
client_properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron'))
producer_close_customer = client.create_producer(topic=CLOSE_CUSTOMER_TOPIC_PRODUCE, schema=AvroSchema(CloseCustomer), producer_name=PULSAR_CLIENT_NAME, properties=client_properties)
producer_customer_closed = client.create_producer(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), producer_name=PULSAR_CLIENT_NAME, properties=client_properties)

# Publishing first CloseCustomer command message!
open_customers={}

command_closecustomer_content = CloseCustomer( publishIntervalSeconds = int(PUBLISH_INTERVAL_SECONDS)
                                              , closeRandomizeMin = int(CLOSE_RANDOMIZE_MIN)
                                              , closeRandomizeMax = int(CLOSE_RANDOMIZE_MAX))

publish_command_closecustomer(command_closecustomer_content)
print ('Info: Sended CloseCustomer command message')

# Created threaded consumers
consume_close_customer = threading.Thread(target=consume_command_closecustomer)
consume_close_customer.daemon = True
consume_close_customer.start()
consume_customer = threading.Thread(target=consume_event_customer)
consume_customer.daemon = True
consume_customer.start()

while True:
    time.sleep(1)

client.close()
