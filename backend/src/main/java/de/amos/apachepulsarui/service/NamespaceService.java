/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.Namespaces;
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

    private final TopicService topicService;

    public List<NamespaceDto> getAll() {
        return tenantService.getAllTenants().stream()
                .flatMap(tenant -> this.getAllOfTenant(tenant).stream())
                .toList();
    }

    public List<NamespaceDto> getAllOfTenant(TenantDto tenant) {
        try {
            return pulsarAdmin.namespaces()
                    .getNamespaces(tenant.getId()).stream()
                    .map(NamespaceDto::fromString)
                    .map(this::enrichWithNamespaceData)
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch namespaces of tenant %s. E: %s".formatted(tenant.getId(), e));
            return List.of();
        }
    }

    private NamespaceDto enrichWithNamespaceData(NamespaceDto namespace) {
        try {
            Namespaces namespaces = pulsarAdmin.namespaces();

            namespace.setBundlesData(namespaces.getBundles(namespace.getId()));
            namespace.setMessagesTTL(namespaces.getNamespaceMessageTTL(namespace.getId()));
            namespace.setRetentionPolicies(namespaces.getRetention(namespace.getId()));
            namespace.setTopics(topicService.getByNamespace(namespace, 10)); //ToDo set max count in topicservice? or somewhere else than here

            return namespace;
        } catch (PulsarAdminException e) {
            log.error("Could not fetch namespace data of namespace %s. E: %s".formatted(namespace.getId(), e));
            return namespace;
        }
    }

}
