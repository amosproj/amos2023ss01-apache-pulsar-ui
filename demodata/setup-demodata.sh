bin/pulsar-admin tenants create neuron-demo
bin/pulsar-admin namespaces create neuron-demo/customer
bin/pulsar-admin topics create neuron-demo/customer/command.create-customer.v1

bin/pulsar-admin topics create neuron-demo/customer/command.update-customer.v1

bin/pulsar-admin topics create neuron-demo/customer/command.close-customer.v1
bin/pulsar-admin topics set-message-ttl neuron-demo/customer/command.close-customer.v1 --ttl 30


bin/pulsar-admin topics create neuron-demo/customer/command.open-customer.v1
bin/pulsar-admin topics set-message-ttl neuron-demo/customer/command.close-customer.v1 --ttl 30


bin/pulsar-admin tenants create rbi-demo
bin/pulsar-admin namespaces create rbi-demo/customer
bin/pulsar-admin namespaces set-retention -s 5M -t 2h rbi-demo/customer
bin/pulsar-admin topics create rbi-demo/customer/event.neuron-demo-customer.v1
bin/pulsar-admin topics enable-deduplication rbi-demo/customer/event.neuron-demo-customer.v1
bin/pulsar-admin topics set-deduplication-snapshot-interval rbi-demo/customer/event.neuron-demo-customer.v1 -i 10


#set-deduplication
bin/pulsar-admin topics get-message-ttl neuron-demo/customer/command.create-customer.v1
bin/pulsar-admin namespaces set-retention -s 5M -t 2h neuron-demo/customer
bin/pulsar-admin topics stats neuron-demo/customer/command.create-customer.v1
bin/pulsar-admin topics set-deduplication

bin/pulsar-admin namespaces set-retention -s 5M -t 2h neuron-demo/customer

bin/pulsar-admin topics create-partitioned-topic neuron-demo/customer/event.customer.v1 -p 10


bin/pulsar-admin topics clear-backlog -s tech-rbi-neuron-demo-create-customer neuron-demo/customer/command.create-customer.v1
bin/pulsar-admin topics clear-backlog -s tech-rbi-neuron-demo-create-customer rbi-demo/customer/event.neuron-demo-customer.v1
bin/pulsar-admin topics clear-backlog -s tech-rbi-neuron-demo-update-customer neuron-demo/customer/command.update-customer.v1
bin/pulsar-admin topics clear-backlog -s tech-rbi-neuron-demo-update-customer rbi-demo/customer/event.neuron-demo-customer.v1
bin/pulsar-admin topics clear-backlog -s tech-rbi-neuron-demo-close-customer rbi-demo/customer/event.neuron-demo-customer.v1

bin/pulsar-admin topics stats neuron-demo/customer/command.create-customer.v1


bin/pulsar-admin topics list neuron-demo/customer
bin/pulsar-admin topics delete-partitioned-topic neuron-demo/customer/event.customer.v1
bin/pulsar-admin topics delete-partitioned-topic neuron-demo/customer/command.customer.v2
bin/pulsar-admin topics delete-partitioned-topic neuron-demo/customer/event.customer.v1
bin/pulsar-admin topics delete neuron-demo/customer/event.customer.v1
bin/pulsar-admin topics delete neuron-demo/customer/command.create-customer.v1

bin/pulsar-admin namespaces delete neuron-demo/customer
bin/pulsar-admin tenants create neuron-demo
