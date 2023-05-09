# Apache Pulsar Ui (AMOS SS 2023)

## Requirements 

* Java Version **17.0.1** or higher 
* Node.js Version **20.0.0** or higher
* Docker Desktop
* Maven

## Backend

First start Docker Desktop and create the pulsar setup from the root-directory with:

```docker-compose up -d```

Then start the application from the `backend` directory with:

```mvn spring-boot:run```

After the start, all old topics are automatically removed from the Pulsar instance and some new topics, messages and
consumers are added.

### Tests

The tests (integration tests) don't use the docker-compose setup,
but instead use testcontainers. Therefore, docker needs to be running.

To start the tests use:

```mvn test```

### REST API

The backend is running on Port 8081 and the prefix of the REST endpoint is `/api`. A complete documentation can
be found here:
http://localhost:8081/api/swagger-ui/index.html
