/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Namespace;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NamespaceService {

    private final PulsarAdmin pulsarAdmin;
    private final TenantService tenantService;

    public List<Namespace> getAllNamespaces() {
        return tenantService.getAllTenants().stream()
                .flatMap(tenant -> {
                    try {
                        return pulsarAdmin.namespaces().getNamespaces(tenant.getId()).stream()
                                .map(namespace -> Namespace.builder()
                                        .id(namespace)
                                        .build());
                    } catch (PulsarAdminException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();
    }
}
