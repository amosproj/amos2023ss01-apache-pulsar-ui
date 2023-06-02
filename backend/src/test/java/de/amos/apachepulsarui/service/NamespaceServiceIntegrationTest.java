/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class NamespaceServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private NamespaceService namespaceService;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @BeforeAll
    void createTenantsAndNamespaces() throws PulsarAdminException {
        createTenant("tenant1");
        createTenant("tenant2");
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace1");
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace2");
        pulsarAdmin.namespaces().createNamespace("tenant2/namespace3");
    }

    @Test
    void getAllOfTenant_returnsNamespacesOfTenant() {
        List<NamespaceDto> namespaces = namespaceService.getAllOfTenant(TenantDto.fromString("tenant1"));
        var namespaceIds = namespaces.stream().map(NamespaceDto::getId).toList();
        Assertions.assertThat(namespaceIds).contains("tenant1/namespace1", "tenant1/namespace2");
        Assertions.assertThat(namespaceIds).doesNotContain("tenant2/namespace3");
    }

    @Test
    void getAllNames_returnsAllNamespaces() {
        List<TenantDto> tenants = List.of(TenantDto.fromString("tenant1"), TenantDto.fromString("tenant2"));
        List<String> namespaces = namespaceService.getAllNames(tenants);
        Assertions.assertThat(namespaces).contains("tenant1/namespace1", "tenant1/namespace2","tenant2/namespace3");
    }

    @Test
    void getNamespaceDetails_returnsNamespaces() throws PulsarAdminException {
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace4");
        pulsarAdmin.topics().createNonPartitionedTopic("persistent://tenant1/namespace4/testTopic");

        NamespaceDto namespace = namespaceService.getNamespaceDetails("tenant1/namespace4");

        Assertions.assertThat(namespace.getId()).isEqualTo("tenant1/namespace4");
        Assertions.assertThat(namespace.getTopics()).contains("persistent://tenant1/namespace4/testTopic");
        Assertions.assertThat(namespace.getAmountOfTopics()).isEqualTo(1);
    }

    private void createTenant(String tenant) throws PulsarAdminException {
        var clusters = pulsarAdmin.clusters().getClusters();
        pulsarAdmin.tenants().createTenant(tenant, TenantInfo.builder()
                .allowedClusters(new HashSet<>(clusters)).build());
    }

}
