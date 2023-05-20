#
# SPDX-License-Identifier: MIT
# SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
#

docker run -it -p 6650:6650  -p 8080:8080 --rm --user 0:0 --mount source=pulsardata,target=/pulsar/data --mount source=pulsarconf,target=/pulsar/conf apachepulsar/pulsar:2.9.2 sh -c 'sed -i "s|systemTopicEnabled=false|systemTopicEnabled=true|g" conf/standalone.conf && sed -i "s|topicLevelPoliciesEnabled=false|topicLevelPoliciesEnabled=true|g" conf/standalone.conf && bin/pulsar standalone'

docker run --rm -e PULSAR_URL='pulsar://host.docker.internal:6650' -it --mount type=bind,source=/tmp,target=/tmp createcustomer


pip index versions --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org pulsar-client
pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org pulsar-client==2.9.2
pip3 install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org jwcrypto


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
