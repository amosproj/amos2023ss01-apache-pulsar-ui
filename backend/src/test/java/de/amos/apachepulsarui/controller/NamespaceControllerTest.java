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
    void getAll_WithTenants_returnsAllNamespacesFromTenants() throws Exception {

        List<NamespaceDto> namespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant2/namespace1"));

        List<String> tenants = List.of("tenant1", "tenant2");
        Mockito.when(namespaceService.getAllForTenants(tenants)).thenReturn(namespaces);

        mockMvc.perform(get("/namespace/all?tenants=tenant1,tenant2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[0].tenant", equalTo(namespaces.get(0).getTenant())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[1].tenant", equalTo(namespaces.get(1).getTenant())));
    }

    @Test
    void getAll_WithNamespaces_returnsSelectedNamespaces() throws Exception {

        List<NamespaceDto> namespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant2/namespace1"));

        List<String> namespaceNames = List.of("tenant1/namespace1", "tenant2/namespace1");
        Mockito.when(namespaceService.getAllForNamespaces(namespaceNames)).thenReturn(namespaces);

        mockMvc.perform(get("/namespace/all?namespaces=tenant1/namespace1,tenant2/namespace1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[0].tenant", equalTo(namespaces.get(0).getTenant())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[1].tenant", equalTo(namespaces.get(1).getTenant())));
    }

    @Test
    void getAll_WithNothing_returnsAllNamespacesFromAllTenants() throws Exception {

        List<NamespaceDto> namespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant2/namespace1"));

        List<String> tenants = List.of("tenant1", "tenant2");
        Mockito.when(tenantService.getAllNames()).thenReturn(tenants);
        Mockito.when(namespaceService.getAllForTenants(tenants)).thenReturn(namespaces);

        mockMvc.perform(get("/namespace/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[0].tenant", equalTo(namespaces.get(0).getTenant())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[1].tenant", equalTo(namespaces.get(1).getTenant())));
    }

    @Test
    void getNamespaceDetails_returnsNamespace() throws Exception {

        NamespaceDetailDto namespace = NamespaceDetailDto.fromString("tenantX/namespace1");
        namespace.setTopics(List.of("a", "b"));

        Mockito.when(namespaceService.getNamespaceDetails("tenantX/namespace1")).thenReturn(namespace);

        mockMvc.perform(get("/namespace?name=tenantX/namespace1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(namespace.getId())))
                .andExpect(jsonPath("$.topics", equalTo(namespace.getTopics())));
    }

}
