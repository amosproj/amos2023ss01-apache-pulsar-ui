# Apache Pulsar Ui (AMOS SS 2023)

## Project Mission

The mission of our project is well aligned with our product [vision](https://docs.google.com/spreadsheets/d/1I5EbfJtnI81RnwBSzQUbqHXc9BeGBDle5ZD8TFL68DY/). Because our mission consists of building a Web-UI that can easily be used by users that have some experience with managing and maintaining Apache Pulsar installations to understand and work on their infrastructure.

We want to achieve this by structuring our UI according to the topology of Apache Pulsar, so that it can be navigated intuitively for targeted exploration of issues. With our Apache Pulsar UI issues can be located, and potential optimizations can easily be searched for, identified, and implemented.

## Requirements 

* Java Version **17.0.1** or higher 
* Node.js Version **20.0.0** or higher
* Docker Desktop

## Startup

First, build the application JAR from the `backend` directory with:

`./mvnw package -DskipTests`

### Start Frontend, Backend and Pulsar instance without demodata

Start Docker Desktop and create the pulsar setup from the root-directory with:

```bash
echo BACKEND_IP=localhost >> .env
docker-compose --profile backend --profile frontend up --build -d
```

### Start Frontend, Backend and Pulsar instance with demodata

Start Docker Desktop and create the pulsar setup from the root-directory with:

```bash
echo BACKEND_IP=localhost >> .env
```
```bash
docker-compose --profile backend --profile frontend --profile demodata -f docker-compose.yml -f docker-compose-setup.yml up --build -d
```

Notes: 
* The `docker-compose.yml` includes the pulsar, backend and frontend services.
* The `docker-compose-setup.yml` includes services for the local demodata setup. `-f` selects the files used for the startup.
* `--build` is needed for the first startup, or when the demodata docker images are changed
* `-d` runs the container in the background, so u can close the terminal without terminating the app itself.
* `--profile demodata` is needed when you want to create the demo topology and start the demo producers & consumers, that will continuously send and receive messages
* `--profile backend` is needed when you want to start the backend via the docker-compose setup. See below for starting it manually.
* `--profile frontend` is needed when you want to start the frontend via the docker-compose setup. 

### Starting the backend separately

If you want to start the backend individually (e.g. during development), simply omit the `--profile backend` from the docker-compose command.
Instead, start the application from the `backend` directory with:

`./mvnw spring-boot:run`

### Tests

The tests (integration tests) don't use the docker-compose setup,
but instead use testcontainers. Therefore, docker needs to be running.

To start the tests use:

`./mvnw test`

### REST API

The backend is running on Port 8081 and the prefix of the REST endpoint is `/api`. A complete documentation can
be found here:
http://localhost:8081/api/swagger-ui/index.html


### Running on AWS

For testing the scalability of our project, we want to test it on AWS with a bigger topology.
We created a separate setup-topology for that - To start the backend using this, you need to run the following command.
Each time the EC2 instance is started again, it will be assigned a new IP address,
so you need to pass it to the `docker-compose` via `-e` flag.

```bash
echo BACKEND_IP=${EC2_IP_ADDRESS} >> .env
```
```bash
docker-compose --profile backend --profile frontend --profile demodata-aws -f docker-compose.yml -f docker-compose-setup-aws.yml up --build -d
```

Notes: 
* The `docker-compose-setup-aws.yml` includes services for the aws demodata setup. 
* `--profile demodata-aws` is needed when you want to create the aws demo topology.
