# Apache Pulsar Ui (AMOS SS 2023)

## Backend

First start the pulsar setup from the root-directory with:

```docker-compose up```

Then start the application from the `backend` directory with:

```./mvnw spring-boot:run```

### Tests

The tests (integration tests) don't use the docker-compose setup, 
but instead use testcontainers. Therefore, docker needs to be running.

To start the tests use:

```./mvnw test```
