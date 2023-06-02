/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

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

@WebMvcTest(TenantController.class)
public class TenantControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    TenantService tenantService;

    @Test
    void getAllTenants_returnsAllTenants() throws Exception {

        List<String> tenants = List.of("tenant1", "tenant2");

        Mockito.when(tenantService.getAllNames()).thenReturn(tenants);

        mockMvc.perform(get("/tenant/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenants[0]", equalTo(tenants.get(0))))
                .andExpect(jsonPath("$.tenants[1]", equalTo(tenants.get(1))));
    }

}
