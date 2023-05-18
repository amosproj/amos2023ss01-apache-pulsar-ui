/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
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
public class TenantServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TenantService tenantService;

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
    void getAllTenants_returnsTenants() {
        List<TenantDto> tenants = tenantService.getAllTenants();
        var tenant1 = tenants.stream()
                .filter(tenant -> tenant.getId().equals("tenant1"))
                .findFirst().orElseThrow();
        var tenant2 = tenants.stream()
                .filter(tenant -> tenant.getId().equals("tenant2"))
                .findFirst().orElseThrow();
        Assertions.assertThat(tenant1).isNotNull();
        Assertions.assertThat(tenant2).isNotNull();
        Assertions.assertThat(tenant1.getNamespaces())
                .extracting(NamespaceDto::getId)
                .containsExactlyInAnyOrder("tenant1/namespace1", "tenant1/namespace2");
        Assertions.assertThat(tenant2.getNamespaces())
                .extracting(NamespaceDto::getId)
                .containsExactlyInAnyOrder("tenant2/namespace1");
    }

    private void createTenant(String tenant) throws PulsarAdminException {
        var clusters = pulsarAdmin.clusters().getClusters();
        pulsarAdmin.tenants().createTenant(tenant, TenantInfo.builder()
                .allowedClusters(new HashSet<>(clusters)).build());
    }

}
