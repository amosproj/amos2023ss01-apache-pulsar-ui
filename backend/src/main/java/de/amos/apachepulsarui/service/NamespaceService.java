/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
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

    public List<String> getAllNames(List<String> tenants) {
        return tenants.stream()
                .flatMap(tenantName -> getAllOfTenant(tenantName).stream())
                .toList();
    }

    public NamespaceDto getNamespaceDetails(String namespaceName) {
        return enrichWithNamespaceData(NamespaceDto.fromString(namespaceName));
    }

    public List<String> getAllOfTenant(String tenantName) throws PulsarApiException {
        try {
            return pulsarAdmin.namespaces().getNamespaces(tenantName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch namespaces of tenant '%s'".formatted(tenantName), e);
        }
    }

    private NamespaceDto enrichWithNamespaceData(NamespaceDto namespace) throws PulsarApiException {
        try {

            Namespaces namespaces = pulsarAdmin.namespaces();

            namespace.setBundlesData(namespaces.getBundles(namespace.getId()));
            namespace.setMessagesTTL(namespaces.getNamespaceMessageTTL(namespace.getId()));
            namespace.setRetentionPolicies(namespaces.getRetention(namespace.getId()));
            namespace.setTopics(topicService.getAllByNamespace(namespace.getId()));

            return namespace;
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch namespace data of namespace '%s'".formatted(namespace.getId()), e
            );
        }
    }

}
