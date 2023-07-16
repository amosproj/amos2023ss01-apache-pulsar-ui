/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDetailDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.Namespaces;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NamespaceService {

    private final PulsarAdmin pulsarAdmin;

    private final TopicService topicService;

    public List<String> getNamespaceNamesForTenants(List<String> tenants) {
        return tenants.stream()
                .flatMap(tenantName -> getAllOfTenant(tenantName).stream())
                .toList();
    }

    public List<NamespaceDto> getAllForNamespaces(List<String> namespaces) {
        return namespaces.stream()
                .map(NamespaceDto::fromString)
                .map(this::enrichWithCardDetails).toList();
    }

    public List<NamespaceDto> getAllForTenants(List<String> tenants) {
        return tenants.stream()
                .flatMap(tenantName -> getAllOfTenant(tenantName).stream())
                .map(NamespaceDto::fromString)
                .map(this::enrichWithCardDetails)
                .toList();
    }

    @Cacheable("namespace.detail")
    public NamespaceDetailDto getNamespaceDetails(String namespace) {
        try {

            Namespaces namespaces = pulsarAdmin.namespaces();

            return NamespaceDetailDto.create(
                    namespace,
                    namespaces.getBundles(namespace),
                    namespaces.getNamespaceMessageTTL(namespace),
                    namespaces.getRetention(namespace),
                    topicService.getAllForNamespace(namespace)
            );
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch namespace data of namespace '%s'".formatted(namespace), e
            );
        }
    }

    @Cacheable("namespace.allNames")
    public List<String> getAllOfTenant(String tenantName) throws PulsarApiException {
        try {
            return pulsarAdmin.namespaces().getNamespaces(tenantName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch namespaces of tenant '%s'".formatted(tenantName), e);
        }
    }

    private NamespaceDetailDto enrichWithNamespaceData(NamespaceDetailDto namespace) throws PulsarApiException {
        try {

            Namespaces namespaces = pulsarAdmin.namespaces();
            namespace.setBundlesData(namespaces.getBundles(namespace.getName()));
            namespace.setMessagesTTL(namespaces.getNamespaceMessageTTL(namespace.getName()));
            namespace.setRetentionPolicies(namespaces.getRetention(namespace.getName()));
            namespace.setTopics(topicService.getAllForNamespace(namespace.getName()));

            return namespace;
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch namespace data of namespace '%s'".formatted(namespace.getName()), e
            );
        }
    }

    private NamespaceDto enrichWithCardDetails(NamespaceDto namespace) {
            namespace.setNumberOfTopics(topicService.getAllForNamespace(namespace.getId()).size());
            return namespace;
    }
}
