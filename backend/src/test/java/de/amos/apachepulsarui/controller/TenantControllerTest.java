/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.service.TenantService;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static java.util.Collections.emptyList;
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

        TenantInfo TenantInfoImpl = null;
        List<TenantDto> tenants = List.of(TenantDto.create(TenantInfoImpl, "abc"));

        Mockito.when(tenantService.getAllFiltered(emptyList())).thenReturn(tenants);

        mockMvc.perform(get("/tenant/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenants[0].name", equalTo("abc")));

    }


    @Test
    void getAllTenants_returnsFilteredTenants() throws Exception {

        List<TenantDto> tenants = List.of(TenantDto.create(null, "abc"));

        Mockito.when(tenantService.getAllFiltered(List.of("abc"))).thenReturn(tenants);

        mockMvc.perform(get("/tenant/all?tenants=abc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tenants[0].name", equalTo("abc")));

    }

}
