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

    private final TopicService topicService;

    public List<String> getAllNames(List<TenantDto> tenants) {
        return tenants.stream()
                .flatMap(tenant -> getAllOfTenant(tenant).stream().map(
                        NamespaceDto::getId
                ))
                .toList();
    }

    public NamespaceDto getNamespaceDetails(String name) {
        return enrichWithNamespaceData(NamespaceDto.fromString(name));
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
            namespace.setTopics(topicService.getAllNamesByNamespace(namespace.getId()));

            return namespace;
        } catch (PulsarAdminException e) {
            log.error("Could not fetch namespace data of namespace %s. E: %s".formatted(namespace.getId(), e));
            return namespace;
        }
    }
}
