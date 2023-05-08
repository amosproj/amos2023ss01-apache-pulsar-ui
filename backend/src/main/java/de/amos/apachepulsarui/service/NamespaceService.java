/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Namespace;
import de.amos.apachepulsarui.domain.Tenant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NamespaceService {

    private final PulsarAdmin pulsarAdmin;
    private final TenantService tenantService;

    public List<Namespace> getAll() {
        return tenantService.getAllTenants().stream()
                .flatMap(tenant -> this.getAllOfTenant(tenant).stream())
                .toList();
    }

    public List<Namespace> getAllOfTenant(Tenant tenant) {
        try {
            return pulsarAdmin.namespaces()
                    .getNamespaces(tenant.getId()).stream()
                    .map(namespace -> Namespace.builder()
                            .id(namespace)
                            .build())
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch namespaces of tenant %s. E: %s".formatted(tenant.getId(), e));
            return List.of();
        }
    }

}
