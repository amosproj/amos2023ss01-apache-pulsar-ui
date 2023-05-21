# Apache Pulsar Ui (AMOS SS 2023)

## Project Mission

The mission of our project is well aligned with our product [vision](https://docs.google.com/spreadsheets/d/1I5EbfJtnI81RnwBSzQUbqHXc9BeGBDle5ZD8TFL68DY/). Because our mission consists of building a Web-UI that can easily be used by users that have some experience with managing and maintaining Apache Pulsar installations to understand and work on their infrastructure.

We want to achieve this by structuring our UI according to the topology of Apache Pulsar, so that it can be navigated intuitively for targeted exploration of issues. With our Apache Pulsar UI issues can be located, and potential optimizations can easily be searched for, identified, and implemented.

## Requirements 

* Java Version **17.0.1** or higher 
* Node.js Version **20.0.0** or higher
* Docker Desktop

## Backend

First start Docker Desktop and create the pulsar setup from the root-directory with:

```docker-compose up --build```

(`--build` is only needed for the first startup)

Then start the application from the `backend` directory with:

```./mvnw spring-boot:run```

After the start, all old topics are automatically removed from the Pulsar instance and some new topics, messages and
consumers are added.

### Tests

The tests (integration tests) don't use the docker-compose setup,
but instead use testcontainers. Therefore, docker needs to be running.

To start the tests use:

```./mvnw test```

### REST API

The backend is running on Port 8081 and the prefix of the REST endpoint is `/api`. A complete documentation can
be found here:
http://localhost:8081/api/swagger-ui/index.html
