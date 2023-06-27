set -x

if [ $USE_AWS = true ] ; then
    /setup-topology-aws.sh

else
    /setup-topology-local.sh

fi