/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Consumer;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class NamespaceServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private NamespaceService namespaceService;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Autowired
    private PulsarClient pulsarClient;

    @BeforeAll
    void createTenantsAndNamespaces() throws PulsarAdminException {
        createTenant("tenant1");
        createTenant("tenant2");
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace1");
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace2");
        pulsarAdmin.namespaces().createNamespace("tenant2/namespace3");
    }

    @Test
    void getAllNamespaces_returnsNamespaces() {
        List<NamespaceDto> namespaces = namespaceService.getAll();
        var namespaceIds = namespaces.stream().map(NamespaceDto::getId).toList();
        Assertions.assertThat(namespaceIds).contains("tenant1/namespace1", "tenant1/namespace2", "tenant2/namespace3");
    }

    @Test
    void getAllNamespacesOfTenant_returnsNamespacesOfTenant() {
        List<NamespaceDto> namespaces = namespaceService.getAllOfTenant(TenantDto.fromString("tenant1"));
        var namespaceIds = namespaces.stream().map(NamespaceDto::getId).toList();
        Assertions.assertThat(namespaceIds).contains("tenant1/namespace1", "tenant1/namespace2");
        Assertions.assertThat(namespaceIds).doesNotContain("tenant2/namespace3");
    }

    @Test
    void getAllNamespaces_returnsMessageCount() throws Exception {
        String topicName = "persistent://tenant1/namespace1/namespace-service-integration-test";
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().topic(topicName).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe()) {
            // receive needs to happen before send, but we don't want to block -> async
            // after the message was sent, we need to ensure it was received -> .get()
            CompletableFuture<Message<byte[]>> consume1 = consumer.receiveAsync();
            producer.send(message);
            consume1.get();

            CompletableFuture<Message<byte[]>> consume2 = consumer.receiveAsync();
            producer.send(message);
            consume2.get();

            producer.send(message);
        }
        List<NamespaceDto> namespaces = namespaceService.getAll();
        var namespace = namespaces.stream()
                .filter(n -> n.getId().equals("tenant1/namespace1"))
                .findFirst()
                .orElseThrow();
        Assertions.assertThat(namespace.getProducedMessages()).isEqualTo(3);
        Assertions.assertThat(namespace.getConsumedMessages()).isEqualTo(2);
    }

    private void createTenant(String tenant) throws PulsarAdminException {
        var clusters = pulsarAdmin.clusters().getClusters();
        pulsarAdmin.tenants().createTenant(tenant, TenantInfo.builder()
                .allowedClusters(new HashSet<>(clusters)).build());
    }

}
