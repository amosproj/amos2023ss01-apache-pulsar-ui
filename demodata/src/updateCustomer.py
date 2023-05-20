import os
import threading
import random
import uuid
import time
from pathlib import Path
from datetime import datetime, timedelta

import pulsar
from pulsar.schema import *
from pulsar import ConsumerType
from models import PulsarClientProperties, MessageProperties, UpdateCustomer, CustomerEvent

import pandas as pd
import numpy as np
from faker import Faker


### CONFIG from ENV ###
# State file
STATE_FILE_PATH = os.getenv('STATE_FILE_PATH', default='/tmp/update-customer-pkl.state')

# Neuron
# export PULSAR_URL='pulsar://localhost:6650'
PULSAR_URL = os.getenv('PULSAR_URL')
if PULSAR_URL is None:
    print('$PULSAR_URL missing')
    exit(1)

# Topics
UPDATE_CUSTOMER_TOPIC_PRODUCE = os.getenv('UPDATE_CUSTOMER_TOPIC_PRODUCE', default='persistent://neuron-demo/customer/command.update-customer.v1')
UPDATE_CUSTOMER_TOPIC_CONSUME = os.getenv('UPDATE_CUSTOMER_TOPIC_CONSUME', UPDATE_CUSTOMER_TOPIC_PRODUCE)
CUSTOMER_TOPIC = os.getenv('CUSTOMER_TOPIC', default='persistent://rbi-demo/customer/event.neuron-demo-customer.v1')

# Producer settings
PULSAR_CLIENT_NAME = os.getenv('PULSAR_CLIENT_NAME', default='tech-rbi-neuron-demo-update-customer')

# Business settings
PUBLISH_INTERVAL_SECONDS = os.getenv('PUBLISH_INTERVAL_SECONDS', default='10')

UPDATE_RANDOMIZE_MIN = os.getenv('UPDATE_RANDOMIZE_MIN', default='1')
UPDATE_RANDOMIZE_MAX = os.getenv('UPDATE_RANDOMIZE_MAX', default='3')

def publish_command_updatecustomer (content):
    # Hint: Have a look at class MessageProperties and "deliver_after" functionality
    producer_update_customer.send(content=content, properties=vars(MessageProperties(message_name='UpdateCustomer')), deliver_after=timedelta(seconds=content.publishIntervalSeconds))

def publish_event_customerupdated (update_customer, correlation_id, causation_id):
    number_of_customers_to_update=random.randint(update_customer.updateRandomizeMin,update_customer.updateRandomizeMax)

    if len(open_customers) < number_of_customers_to_update:
        number_of_customers_to_update = len(open_customers)
    print (f'Info: Send {number_of_customers_to_update} CustomerUpdated event(s) based on parameters and open customer(s) known in dict: {len(open_customers)}.')
   
    for x in range(number_of_customers_to_update):
        random_customer_row = random.randint (1, len(open_customers.index))
        random_customer = open_customers[random_customer_row-1:random_customer_row].to_dict(orient="records")
        customer = CustomerEvent(customerId = random_customer[0]['customerId']
                                              , firstName = random_customer[0]['firstName']
                                              , lastName = fake['de_AT'].last_name() # New last name
                                              , title = random_customer[0]['title']
                                              , placeOfBirth = random_customer[0]['placeOfBirth']
                                              , countryOfBirth = random_customer[0]['countryOfBirth']
                                              , dateOfBirth = random_customer[0]['dateOfBirth']
                                              , dateOfOpened = random_customer[0]['dateOfOpened']
                                              , bic = random_customer[0]['bic']
                                              , lineOfBusiness = random_customer[0]['lineOfBusiness']
                                              , status = random_customer[0]['status'])

        # Hint: Have a look at class MessageProperties, partition_key and event_timestamp
        producer_customer_updated.send(content=customer, partition_key=customer.customerId, properties=vars(MessageProperties(message_name='CustomerUpdated', correlation_id=correlation_id, causation_id=causation_id)), event_timestamp=int(time.time() * 1000))
        print (f'Info: Updating customer: {customer.customerId}. CustomerUpdated event send.')
       

def consume_command_updatecustomer ():
  consumer_update_customer = client.subscribe(topic=UPDATE_CUSTOMER_TOPIC_CONSUME, schema=AvroSchema(UpdateCustomer), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Shared)
  while True:
    message = consumer_update_customer.receive()
    properties = message.properties()
    if properties['messageName'] == 'UpdateCustomer':
        publish_event_customerupdated(update_customer=message.value(), correlation_id=properties['correlationId'], causation_id=properties['causationId'])
        publish_command_updatecustomer(message.value())
    consumer_update_customer.acknowledge(message)

def consume_event_customer ():
  consumer_customer = client.subscribe(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron')), subscription_name=PULSAR_CLIENT_NAME, consumer_name=PULSAR_CLIENT_NAME, consumer_type=ConsumerType.Exclusive)

  while True:
    global open_customers
    message = consumer_customer.receive()
    content = message.value()
    properties = message.properties()
    value= message.value()
    if properties['messageName'] in ('CustomerCreated','CustomerUpdated','CustomerOpened'):
        customer_event_dict=vars(content)
        customer_event_df=pd.DataFrame(data=customer_event_dict,index=[customer_event_dict['customerId']])
        if content.customerId in open_customers.index:
            open_customers.loc[content.customerId]=customer_event_df.loc[content.customerId]
        else:
            open_customers=pd.concat([open_customers,customer_event_df])
        print (f'Info: Added customer "{content.customerId}" to from state because of {properties["messageName"]}. Number of customer in state: {len(open_customers.index)}')
    elif properties['messageName'] == 'CustomerClosed':
        open_customers.drop([content.customerId], axis=0, inplace=True)
        print (f'Info: Removed customer "{content.customerId}" from state because of {properties["messageName"]}. Number of customer in state: {len(open_customers.index)}')
    open_customers.to_pickle(STATE_FILE_PATH)
    consumer_customer.acknowledge(message)

# main
random.seed()

## Faker setup
locales = ['de_AT', 'en_US']
fake = Faker(locales)
Faker.seed(random.seed())

## Pulsar client setup
client = pulsar.Client(PULSAR_URL)
client_properties=vars(PulsarClientProperties(name='Max Mustermann', email='neuron@rbinternational.com', url='https://code.rbi.tech/raiffeisen/neuron'))
#client_id = str(uuid.uuid4().fields[-1])[:5]
producer_update_customer = client.create_producer(topic=UPDATE_CUSTOMER_TOPIC_PRODUCE, schema=AvroSchema(UpdateCustomer), producer_name=PULSAR_CLIENT_NAME, properties=client_properties)
producer_customer_updated = client.create_producer(topic=CUSTOMER_TOPIC, schema=AvroSchema(CustomerEvent), producer_name=PULSAR_CLIENT_NAME, properties=client_properties)

## Publishing first UpdateCustomer command message!
open_customers=pd.DataFrame()

path = Path(STATE_FILE_PATH)
if not path.is_file():
    open_customers.to_pickle(path)
    # Init by publishing first CreateCustomer command message!
    command_updatecustomer_content = UpdateCustomer( publishIntervalSeconds = int(PUBLISH_INTERVAL_SECONDS)
                                                   , updateRandomizeMin = int(UPDATE_RANDOMIZE_MIN)
                                                   , updateRandomizeMax = int(UPDATE_RANDOMIZE_MAX))
    publish_command_updatecustomer(command_updatecustomer_content)
    print ('Info: No state found. Sended UpdateCustomer command message')
else:    
    open_customers = pd.read_pickle(path)
    print (f'Info: Starting state from file')

## Created threaded consumers
consume_update_customer = threading.Thread(target=consume_command_updatecustomer)
consume_update_customer.daemon = True
consume_update_customer.start()
consume_customer = threading.Thread(target=consume_event_customer)
consume_customer.daemon = True
consume_customer.start()

while True:
    time.sleep(1)

client.update()
