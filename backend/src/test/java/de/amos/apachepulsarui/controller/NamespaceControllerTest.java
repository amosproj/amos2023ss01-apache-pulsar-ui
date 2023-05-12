/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.service.NamespaceService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    @Test
    void getAllNamespaces_returnsAllNamespaces() throws Exception {

        List<NamespaceDto> namespaces = Stream.of(
                "tenant1/namespace1",
                "tenant1/namespace2",
                "tenant2/namespace1"
        ).map(NamespaceDto::fromString).collect(Collectors.toList());
        namespaces.forEach(namespace -> namespace.setTopics(new ArrayList<>()));

        Mockito.when(namespaceService.getAll()).thenReturn(namespaces);

        mockMvc.perform(get("/namespace"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.namespaces[0].id", equalTo(namespaces.get(0).getId())))
                .andExpect(jsonPath("$.namespaces[1].id", equalTo(namespaces.get(1).getId())))
                .andExpect(jsonPath("$.namespaces[2].id", equalTo(namespaces.get(2).getId())));
    }
}
