/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDetailDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

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
    void getAllNamespacesForTenants_returnsAllNamespaces() throws Exception {

        List<NamespaceDto> tenantNamespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant1/namespace2"),
                NamespaceDto.fromString("tenant2/namespace1"));

        List<String> tenants = List.of("tenant1", "tenant2");
        Mockito.when(tenantService.getAllNames()).thenReturn(tenants);
        Mockito.when(namespaceService.getAllNamespacesForTenants(tenants)).thenReturn(tenantNamespaces);

        mockMvc.perform(get("/namespace/all?tenants=tenant1,tenant2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(tenantNamespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(tenantNamespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[2].id", equalTo(tenantNamespaces.get(2).getId())));
    }

    @Test
    void getNamespaceDetails_returnsNamespace() throws Exception {

        NamespaceDetailDto namespace = NamespaceDetailDto.fromString("tenantX/namespace1");
        namespace.setTopics(List.of("a", "b"));

        Mockito.when(namespaceService.getNamespaceDetails("tenantX/namespace1")).thenReturn(namespace);

        mockMvc.perform(get("/namespace?name=tenantX/namespace1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(namespace.getId())))
                .andExpect(jsonPath("$.amountOfTopics", equalTo(namespace.getAmountOfTopics())))
                .andExpect(jsonPath("$.topics", equalTo(namespace.getTopics())));
    }

}
