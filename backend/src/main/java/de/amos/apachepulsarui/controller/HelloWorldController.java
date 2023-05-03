/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.controller;

/*
@Controller
public class HelloWorldController {

    @GetMapping("/hello_pulsar")
    public ResponseEntity<Object> hello() {

        String pulsarConnectionUrl = "http://localhost:8080";

        try (PulsarAdmin admin = PulsarAdminFactory.create(pulsarConnectionUrl)) {

            // just create some random topics
            admin.topics().createNonPartitionedTopic(UUID.randomUUID().toString());
            admin.topics().createNonPartitionedTopic(UUID.randomUUID().toString());
            admin.topics().createNonPartitionedTopic(UUID.randomUUID().toString());

            // get all topics of "public" tenant
            List<String> namespaces = admin.namespaces().getNamespaces("public");
            List<String> topics = namespaces.stream()
                    .flatMap(namespace -> {
                        try {
                            return admin.topics().getList(namespace).stream();
                        } catch (PulsarAdminException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();

            return new ResponseEntity<>(topics, HttpStatus.OK);

        } catch (PulsarClientException | PulsarAdminException e) {
            return new ResponseEntity<>(
                    "Something went wrong while querying the pulsar applications state: %s".formatted(e),
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<String> helloName(@PathVariable String name) {
        return ResponseEntity.of(Optional.of("Hello " + name));
    }

}
*/