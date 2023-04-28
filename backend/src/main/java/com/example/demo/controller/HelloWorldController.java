package com.example.demo.controller;

import com.example.demo.factory.PulsarAdminFactory;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.PulsarClientException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Controller
public class HelloWorldController {

    @GetMapping("/hello_pulsar")
    public ResponseEntity<Object> hello() {

        String pulsarConnectionUrl = "http://localhost:8080";

        try (PulsarAdmin admin = PulsarAdminFactory.create(pulsarConnectionUrl)) {

            List<String> tenants = admin.tenants().getTenants();
            String fooTenant = tenants.get(0);

            List<String> namespaces = admin.namespaces().getNamespaces(fooTenant);

            List<List<String>> allTopicsOfTenant = namespaces.stream()
                    .map(namespace -> {
                        try {
                            return admin.topics().getList(namespace);
                        } catch (PulsarAdminException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .toList();

            return new ResponseEntity<>(allTopicsOfTenant, HttpStatus.OK);

        } catch (PulsarClientException | PulsarAdminException e) {
            return new ResponseEntity<>(
                    "Somethin went wrong while querying the pulsar applications state",
                    HttpStatus.SERVICE_UNAVAILABLE
            );
        }
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<String> helloName(@PathVariable String name) {
        return ResponseEntity.of(Optional.of("Hello " + name));
    }

}
