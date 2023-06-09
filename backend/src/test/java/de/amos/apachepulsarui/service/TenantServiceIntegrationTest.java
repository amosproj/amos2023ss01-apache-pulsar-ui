/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TenantDetailDto;
import de.amos.apachepulsarui.dto.TenantDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;

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
        List<String> tenants = tenantService.getAllNames();
        var tenantX = tenants.stream()
                .filter(tenant -> tenant.equals("tenantX"))
                .findFirst().orElseThrow();
        var tenantY = tenants.stream()
                .filter(tenant -> tenant.equals("tenantY"))
                .findFirst().orElseThrow();
        Assertions.assertThat(tenantX).isNotNull();
        Assertions.assertThat(tenantY).isNotNull();
        TenantDetailDto tenantDetailsX = tenantService.getTenantDetails(tenantX);
        TenantDetailDto tenantDetailsY = tenantService.getTenantDetails(tenantY);
        Assertions.assertThat(tenantDetailsX.getNamespaces())
                .containsExactlyInAnyOrder("tenantX/namespace1", "tenantX/namespace2");
        Assertions.assertThat(tenantDetailsY.getNamespaces())
                .containsExactlyInAnyOrder("tenantY/namespace1");
    }

    @Test
    void getAllTenatsFiltered() throws PulsarAdminException {
        String name1 = "tenantA";
        String name2 = "tenantB";

        createTenant(name1);
        createTenant(name2);

        List<TenantDto> tenants = tenantService.getAllFiltered(Collections.emptyList());

        List<String> tenantNames = tenants.stream().map(TenantDto::getName).toList();

        assertTrue(tenantNames.contains(name1));
        assertTrue(tenantNames.contains(name2));

    }

    @Test
    void getAllTenatsFiltered2() {
        List<TenantDto> tenants = tenantService.getAllFiltered(List.of("tenantABC"));
        Assertions.assertThat(tenants.size()).isEqualTo(0);
    }

    private void createTenant(String tenant) throws PulsarAdminException {
        var clusters = pulsarAdmin.clusters().getClusters();
        pulsarAdmin.tenants().createTenant(tenant, TenantInfo.builder()
                .allowedClusters(new HashSet<>(clusters)).build());
    }

}
