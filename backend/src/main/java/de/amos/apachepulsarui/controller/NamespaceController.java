/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.NamespacesDto;
import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/namespace")
public class NamespaceController {

    private final NamespaceService namespaceService;
    private final TenantService tenantService;

    @GetMapping("/all")
    public ResponseEntity<NamespacesDto> getAllNamespaces() {
        List<TenantDto> tenants = tenantService.getAllTenants();
        List<String> namespaceDtos = tenants.stream()
                .flatMap(tenant -> namespaceService.getAllOfTenant(tenant).stream().map(
                        NamespaceDto::getId
                ))
                .toList();
        return new ResponseEntity<>(new NamespacesDto(namespaceDtos), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<NamespaceDto> getNamespace(@RequestParam String name) {
        return new ResponseEntity<>(namespaceService.getNamespaceByName(name), HttpStatus.OK);
    }

}
