FROM apachepulsar/pulsar:3.0.0
COPY setup-topology.sh /setup-topology.sh
COPY setup-topology-aws.sh /setup-topology-aws.sh
COPY setup-topology-local.sh /setup-topology-local.sh

ENTRYPOINT ["/bin/bash", "-c", "/setup-topology.sh"]
