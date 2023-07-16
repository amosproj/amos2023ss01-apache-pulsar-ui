set -x

bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics list retail-banking/Transactions
if [ $? -eq 0 ]; then    
    echo "Topics found. Skipping topology setup."
else
    echo "Setting up topology."

    # tenant retail-banking
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create retail-banking

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces create retail-banking/FraudDetection
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces set-retention -s 5M -t 2h retail-banking/FraudDetection
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create retail-banking/FraudDetection/FraudAlerts

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces create retail-banking/Transactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces set-retention -s 5M -t 2h retail-banking/Transactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create retail-banking/Transactions/ATMTransactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics set-message-ttl --ttl 30 retail-banking/Transactions/ATMTransactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create retail-banking/Transactions/OnlinePurchases
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics set-message-ttl --ttl 30 retail-banking/Transactions/OnlinePurchases    
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create retail-banking/Transactions/FundTransfers
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics set-message-ttl --ttl 30 retail-banking/Transactions/FundTransfers

    # tenant corporate-banking

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create corporate-banking

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces create corporate-banking/Transactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL namespaces set-retention -s 5M -t 2h corporate-banking/Transactions

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create corporate-banking/Transactions/ATMTransactions
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create corporate-banking/Transactions/OnlinePurchases
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL topics create corporate-banking/Transactions/FundTransfers

    # other tenants

    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create credit-card-services
    bin/pulsar-admin --admin-url $PULSAR_ADMIN_URL tenants create stock-market-trading





fi