/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NamespaceController.class)
public class NamespaceControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    NamespaceService namespaceService;

    @MockBean
    TenantService tenantService;

    @Test
    void getAllNamespaces_returnsAllNamespacesAsStrings() throws Exception {

        List<NamespaceDto> tenant1Namespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant1/namespace2"));
        List<NamespaceDto> tenant2Namespaces = List.of(
                NamespaceDto.fromString("tenant2/namespace1"));
        tenant1Namespaces.forEach(namespace -> namespace.setTopics(new ArrayList<>()));
        tenant2Namespaces.forEach(namespace -> namespace.setTopics(new ArrayList<>()));

        List<TenantDto> tenants = List.of(TenantDto.fromString("tenant1"),
                TenantDto.fromString("tenant2"));
        Mockito.when(tenantService.getAllTenants()).thenReturn(tenants);
        Mockito.when(namespaceService.getAllOfTenant(tenants.get(0))).thenReturn(tenant1Namespaces);
        Mockito.when(namespaceService.getAllOfTenant(tenants.get(1))).thenReturn(tenant2Namespaces);

        mockMvc.perform(get("/namespace/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0]", equalTo(tenant1Namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[1]", equalTo(tenant1Namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[2]", equalTo(tenant2Namespaces.get(0).getId())));
    }

    @Test
    void getNamespaceByName_returnsNamespace() throws Exception {

        NamespaceDto namespace = NamespaceDto.fromString("tenantX/namespace1");
        namespace.setTopics(List.of("a", "b"));

        Mockito.when(namespaceService.getNamespaceByName("tenantX/namespace1")).thenReturn(namespace);

        mockMvc.perform(get("/namespace?name=tenantX/namespace1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(namespace.getId())))
                .andExpect(jsonPath("$.amountOfTopics", equalTo(namespace.getAmountOfTopics())))
                .andExpect(jsonPath("$.topics", equalTo(namespace.getTopics())));
    }
}
