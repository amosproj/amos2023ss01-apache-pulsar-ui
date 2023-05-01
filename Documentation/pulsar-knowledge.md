This should contain our knowledge about the inner workings of apache pulsar.

# 1. What exactly is a Stream in Apache Pulsar?

- A continuous stream of messages, that can be analyzed, transformed and processed in real time
- In pulsar, Apache BookKeeper is used for message storage, separate from the Pulsar broker that takes care of publishing and subscription

# 2. What are Topics (where are they strored and how do they relate to Producer/Consumer)?

- way to structure data/organize messages -> each topic is a 'storage unit'
- producer publish messages to topics
- consumer can subscribe to topics
- topics can be persistent or non-persistent

Sources: https://pulsar.apache.org/docs/next/tutorials-topic/, https://pulsar.apache.org/docs/2.11.x/concepts-messaging/

# 3. What is the inner Topology of a Apache Pulsar Instance (Instance -> Cluster -> Broker -> Booker -> ...)?

One Pulsar instance consists of one or more Pulsar clusters, in a cluster there are:
- one or more brokers:
    - responsible for receiving messages from producers and sending messages to consumers, including load balancing
    - contains a http server that exposes a REST API for both administrative tasks and topic lookup for producers/consumers
- a BookKeeper cluster:
    - contains one or more bookies 
    - responsible for persistent message storaging 
- a ZooKeeper cluster: 
    - stores the metadata and configuration of its Pulsar cluster
    - responsible for coordination tasks between Pulsar clusters

Source: https://pulsar.apache.org/docs/2.11.x/concepts-architecture-overview/

# 4. How can functions be deployed into a given Apache Pulsar Instance and what are they used for?

What:
- Serverless computing framework that runs on top of pulsar (similar to FunctionsAsAService by e.g. AWS lambda)
- Minimize boilerplate of creating consumers/producers, simplify deployment and operations

Use Cases:
- Lightweight stream processing -> good for basic use cases: aggregations, message transformation etc.
- Not suited to more complex operations like e.g. merging or routing multiple streams
- Run separate pieces of code for the publication of messages
- Can receive messages from one or more topics, when received function applies logic to the input value
- Optional to produce output to output topic 

How:
- Can be written in java/python etc
- Native functions - don't depend on Apache Pulsar libraries, useful for simple operations 
- to use them, need to implement java.util.Function interface, write logic into the apply method
- For more complex use cases, Pulsar provides an sdk with an own Function interface to implement against (method is called process instead of apply)

Source/Further information: https://youtu.be/FbGX1qG9OEM