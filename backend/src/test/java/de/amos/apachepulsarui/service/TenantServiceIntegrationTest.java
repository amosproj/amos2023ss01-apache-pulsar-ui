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
        createTenant("tenantX");
        createTenant("tenantY");
        pulsarAdmin.namespaces().createNamespace("tenantX/namespace1");
        pulsarAdmin.namespaces().createNamespace("tenantX/namespace2");
        pulsarAdmin.namespaces().createNamespace("tenantY/namespace1");
    }

    @Test
    void getAllTenants_returnsTenants() {
        List<TenantDto> tenants = tenantService.getAllTenants();
        var tenantX = tenants.stream()
                .filter(tenant -> tenant.getId().equals("tenantX"))
                .findFirst().orElseThrow();
        var tenantY = tenants.stream()
                .filter(tenant -> tenant.getId().equals("tenantY"))
                .findFirst().orElseThrow();
        Assertions.assertThat(tenantX).isNotNull();
        Assertions.assertThat(tenantY).isNotNull();
        Assertions.assertThat(tenantX.getNamespaces())
                .extracting(NamespaceDto::getId)
                .containsExactlyInAnyOrder("tenantX/namespace1", "tenantX/namespace2");
        Assertions.assertThat(tenantY.getNamespaces())
                .extracting(NamespaceDto::getId)
                .containsExactlyInAnyOrder("tenantY/namespace1");
    }

    private void createTenant(String tenant) throws PulsarAdminException {
        var clusters = pulsarAdmin.clusters().getClusters();
        pulsarAdmin.tenants().createTenant(tenant, TenantInfo.builder()
                .allowedClusters(new HashSet<>(clusters)).build());
    }

}
