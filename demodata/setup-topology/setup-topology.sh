set -x

bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics list neuron-demo/customer
if [ $? -eq 0 ]; then    
    echo "Topics found. Skipping topology setup."
else
    echo "Setting up topology."
    # tenant neuron-demo
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create neuron-demo
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces create neuron-demo/customer
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces set-retention -s 5M -t 2h neuron-demo/customer
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create neuron-demo/customer/command.create-customer.v1
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics set-message-ttl --ttl 30 neuron-demo/customer/command.create-customer.v1 
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create-partitioned-topic -p 2 neuron-demo/customer/event.customer.v1 

    #tenant rbi-demo
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create rbi-demo
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces create rbi-demo/customer
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces set-retention -s 5M -t 2h rbi-demo/customer
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create rbi-demo/customer/event.neuron-demo-customer.v1
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics enable-deduplication rbi-demo/customer/event.neuron-demo-customer.v1
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics set-deduplication-snapshot-interval -i 10 rbi-demo/customer/event.neuron-demo-customer.v1
fi