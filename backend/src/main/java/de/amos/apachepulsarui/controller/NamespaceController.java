/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDetailDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.NamespacesDto;
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

//    @GetMapping("/all")
//    public ResponseEntity<NamespacesDto> getAllNames() {
//        List<String> tenants = tenantService.getAllNames();
//        List<String> namespaces = namespaceService.getAllNames(tenants);
//        return new ResponseEntity<>(new NamespacesDto(namespaces), HttpStatus.OK);
//    }

    @GetMapping("/all")
    public ResponseEntity<NamespacesDto> getAll(@RequestParam(required = false, defaultValue = "") List<String> tenants, @RequestParam(required = false, defaultValue = "") List<String> namespaces) {
        List<NamespaceDto> namespaceDtos;
        if (tenants.isEmpty()) {
            tenants = tenantService.getAllNames();
        }
        if (namespaces.isEmpty()) {
             namespaceDtos = namespaceService.getAllNamespacesForTenants(tenants);
        } else {
            namespaceDtos = namespaceService.getAllNamespacesForNamespaces(namespaces);
        }

        return new ResponseEntity<>(new NamespacesDto(namespaceDtos), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<NamespaceDetailDto> getNamespaceDetails(@RequestParam String name) {
        return new ResponseEntity<>(namespaceService.getNamespaceDetails(name), HttpStatus.OK);
    }

}
