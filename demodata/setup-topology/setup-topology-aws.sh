bin/pulsar-admin --admin-url "$PULSAR_ADMIN_URL" topics list tenant-1/namespace-1
if [ $? -eq 0 ]; then
  echo "Topics found. Skipping topology setup."
else

  echo "Setting up topology."
  x=0
  y=0

  for i in {1..10}; do

    echo "Creating tenant-$i"
    bin/pulsar-admin --admin-url "$PULSAR_ADMIN_URL" tenants create "tenant-$i"

    for j in {1..20}; do

      x=$((x + 1))
      echo "Creating tenant-$i/namespace-$x"
      bin/pulsar-admin --admin-url "$PULSAR_ADMIN_URL" namespaces create "tenant-$i/namespace-$x"

      for k in {1..25}; do

        y=$((y + 1))
        echo "Creating tenant-$i/namespace-$x/topic-$y"
        bin/pulsar-admin --admin-url "$PULSAR_ADMIN_URL" topics create "tenant-$i/namespace-$x/topic-$y"

      done

    done

  done
fi
