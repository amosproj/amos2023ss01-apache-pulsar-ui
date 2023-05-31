/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
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
    void getAllNamespaces_returnsAllNamespaces() throws Exception {

        List<NamespaceDto> tenant1Namespaces = List.of(
                NamespaceDto.fromString("tenant1/namespace1"),
                NamespaceDto.fromString("tenant1/namespace2"));
        List<NamespaceDto> tenant2Namespaces = List.of(
                NamespaceDto.fromString("tenant2/namespace1"));
        tenant1Namespaces.forEach(namespace -> namespace.setTopics(new ArrayList<>()));
        tenant2Namespaces.forEach(namespace -> namespace.setTopics(new ArrayList<>()));

        List<String> tenants = List.of("tenant1", "tenant2");
        Mockito.when(tenantService.getAllNames()).thenReturn(tenants);
        // TODO: reactivate when namespace has been refactored
//        Mockito.when(namespaceService.getAllOfTenant(tenants.get(0))).thenReturn(tenant1Namespaces);
//        Mockito.when(namespaceService.getAllOfTenant(tenants.get(1))).thenReturn(tenant2Namespaces);

        mockMvc.perform(get("/namespace"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(tenant1Namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(tenant1Namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[2].id", equalTo(tenant2Namespaces.get(0).getId())));
    }
}
