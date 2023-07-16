import os
import threading
import random
import time
from datetime import datetime, timedelta
from faker import Faker
import uuid

import pulsar
from pulsar.schema import *
from pulsar import ConsumerType
from models import TransactionEvent, PulsarClientProperties, MessageProperties

### CONFIG from ENV ###
# Neuron
# export PULSAR_URL='pulsar://localhost:6650'
PULSAR_URL = os.getenv('PULSAR_URL')
if PULSAR_URL is None:
    print('$PULSAR_URL missing')
    exit(1)

# Topics
TOPIC_ATM_TRANSACTIONS = 'persistent://retail-banking/Transactions/ATMTransactions'
TOPIC_ONLINE_PURCHASES = 'persistent://retail-banking/Transactions/OnlinePurchases'
TOPIC_FUND_TRANSFERS = 'persistent://retail-banking/Transactions/FundTransfers'

# Producer settings
PRODUCER_NAME = 'bank-transaction-system'

def fake_transaction ():
    return TransactionEvent(
        amount = fake.pricetag(),
        customerId = str(uuid.uuid4()),
        timestamp = datetime.now().isoformat(),
        transactionType = random.choice(['deposit', 'withdrawal', 'check'])
    )

def publish_transaction_event():
    # Hint: Have a look at class MessageProperties and "deliver_after" functionality
    print("############ About to send TransactionEvent #################")
    content = TransactionEvent(
        amount = fake.pricetag(),
        customerId = str(uuid.uuid4()),
        timestamp = datetime.now().isoformat(),
        transactionType = random.choice(['deposit', 'withdrawal', 'check'])
    )
    producer_atm_transactions.send(content=content,
                                properties=vars(MessageProperties(message_name='TransactionEvent')))

def consume_transaction_event():
  consumer_atm_transactions = client.subscribe(topic=TOPIC_ATM_TRANSACTIONS, 
                                              schema=AvroSchema(TransactionEvent), 
                                              properties=client_properties, 
                                              subscription_name=PRODUCER_NAME,
                                              consumer_name=PRODUCER_NAME,
                                              consumer_type=ConsumerType.Shared)

  while True:
    print("Waiting for TransactionEvent message...")
    message = consumer_atm_transactions.receive()
    consumer_atm_transactions.acknowledge(message)
    print("Received message: ")
    print(message.value().__dict__)

### main ###

# Faker setup
fake = Faker(['en_US'])
Faker.seed(random.seed())

# Pulsar client setup
client = pulsar.Client(PULSAR_URL)
client_properties = vars(PulsarClientProperties(name='Fake Bank', email='pulsar@fake-bank.com'))
# Hint: Using batching type "key based" will enable key based shared subscriptions for sharding / scaling.
producer_atm_transactions = client.create_producer(topic=TOPIC_ATM_TRANSACTIONS, schema=AvroSchema(TransactionEvent), producer_name=PRODUCER_NAME, properties=client_properties, batching_type=pulsar.BatchingType.KeyBased)
producer_online_purchases = client.create_producer(topic=TOPIC_ONLINE_PURCHASES, schema=AvroSchema(TransactionEvent), producer_name=PRODUCER_NAME, properties=client_properties, batching_type=pulsar.BatchingType.KeyBased)
producer_fund_transfers = client.create_producer(topic=TOPIC_FUND_TRANSFERS, schema=AvroSchema(TransactionEvent), producer_name=PRODUCER_NAME, properties=client_properties, batching_type=pulsar.BatchingType.KeyBased)

# Created threaded consumer and producer
consume_create_customer = threading.Thread(target=consume_transaction_event)
consume_create_customer.daemon = True
consume_create_customer.start()

while True:
    time.sleep(5)
    publish_transaction_event()

client.close()
