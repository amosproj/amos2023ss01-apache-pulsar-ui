/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDetailDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.List;

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
        List<String> namespaces = namespaceService.getAllOfTenant("tenant1");
        Assertions.assertThat(namespaces).contains("tenant1/namespace1", "tenant1/namespace2");
        Assertions.assertThat(namespaces).doesNotContain("tenant2/namespace3");
    }

    @Test
    void getAllNamespacesForTenants_returnsAllNamespaces() {
        NamespaceDto namespace1 = NamespaceDto.fromString("tenant1/namespace1");
        namespace1.setTenant("tenant1");
        NamespaceDto namespace2 = NamespaceDto.fromString("tenant2/namespace2");
        namespace2.setTenant("tenant2");
        List<String> tenants = List.of("tenant1");
        List<NamespaceDto> namespaces = namespaceService.getAllNamespacesForTenants(tenants);
        Assertions.assertThat(namespaces).contains(namespace1);
    }

    @Test
    void getAllNamespacesForNamespaces_returnsAllNamespaces() {
        List<String> namespaces = List.of("tenant1/namespace1", "tenant1/namespace2");
        NamespaceDto namespace1 = NamespaceDto.fromString("tenant1/namespace1");
        namespace1.setTenant("tenant1");
        NamespaceDto namespace2 = NamespaceDto.fromString("tenant1/namespace2");
        namespace2.setTenant("tenant1");

        List<NamespaceDto> namespaceDtos = namespaceService.getAllNamespacesForNamespaces(namespaces);
        Assertions.assertThat(namespaceDtos).contains(namespace1, namespace2);
    }

    @Test
    void getNamespaceDetails_returnsNamespaces() throws PulsarAdminException {
        pulsarAdmin.namespaces().createNamespace("tenant1/namespace4");
        pulsarAdmin.topics().createNonPartitionedTopic("persistent://tenant1/namespace4/testTopic");

        NamespaceDetailDto namespace = namespaceService.getNamespaceDetails("tenant1/namespace4");

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
