# Description of how to interact with Apache Pulsar (Interfaces)

### Admin API
In general, the [Pulsar Admin API](https://pulsar.apache.org/docs/2.11.x/admin-api-overview/) will be our primary way in 
interaction with a Pulsar application when it comes to querying or manipulating the state of the Pulsar application. 

In general, there exist 3 ways of talking to a Pulsar application: the `pulsar-admin` CLI tool, 
the [REST API](https://pulsar.apache.org/docs/2.11.x/reference-rest-api-overview/), 
and the [Java admin API](https://pulsar.apache.org/api/admin/2.11.x/). 
Assuming we use the Java backend to talk to our Pulsar app, the last is relevant for us.

### Client API
May be relevant regarding the 2. requirements task to send messages in a specific topic, as the client API 
"...allows you to create and configure producers, consumers, and readers; produce and consume messages". 
See [Client API overview](https://pulsar.apache.org/docs/2.11.x/client-api-overview/) for more intel.
A comparison of the capabilities of both APIs can be found [here](https://pulsar.apache.org/docs/2.11.x/pulsar-api-overview/).

# What libraries exist to facilitate the interaction
Pulsar provides the complete Java API including all available packages to interact with the Admin API [here](https://pulsar.apache.org/api/admin/2.11.x/).
Basic setup info on how to interact with the a Pulsar application via the Java API can be found [here](https://pulsar.apache.org/docs/2.11.x/admin-api-get-started/).

Minimum example using localhost:
```java
String url = "http://localhost:8080";
// Pass auth-plugin class fully-qualified name if Pulsar-security enabled
String authPluginClassName = "com.org.MyAuthPluginClass";
// Pass auth-param if auth-plugin class requires it
String authParams = "param1=value1";
boolean tlsAllowInsecureConnection = false;
String tlsTrustCertsFilePath = null;
PulsarAdmin admin = PulsarAdmin.builder()
    .authentication(authPluginClassName,authParams)
    .serviceHttpUrl(url)
    .tlsTrustCertsFilePath(tlsTrustCertsFilePath)
    .allowTlsInsecureConnection(tlsAllowInsecureConnection)
    .build();
```

# Is some form of identification (API Keys, Password, ...) necessary
Only if [Pulsar-security](https://pulsar.apache.org/docs/2.11.x/security-overview/) is enabled. 
See the above minimum example to get an idea how it would work if this is the case.

# Identification of possible pitfalls
- we might need to make use of pagination -> imagine we query for all topics and get like 1000 results 
-> probably we should not pass all results to the frontend
(the Pulsar Manager [does this too](https://github.com/apache/pulsar-manager/blob/master/src/main/java/org/apache/pulsar/manager/controller/TopicsController.java#L89)).
- topics, clusters, namespaces etc. are all returned as Strings 
-> me might wanna introduce objects instead of operating on bare Strings all the time.

# Example: Querying for all topics of a tenant
Getting the data we want is quite straightforward:
```java
// first we need all tenants (https://pulsar.apache.org/api/admin/2.11.x/org/apache/pulsar/client/admin/Tenants.html)
List<String> tenants = admin.tenants().getTenants();
// just select the first one for this example
String fooTenant = tenants.get(0);
// now we will get all namespaces of the tenant
List<String> namespaces = admin.namespaces().getNamespaces(fooTenant );
// get all topics of all namespaces of our tenant
List<String> topics = namespaces.stream()
	.flatMap(namespace -> admin.topics().getList(namespace).stream())
	.toList();
```
