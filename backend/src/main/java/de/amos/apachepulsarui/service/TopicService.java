/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Namespace;
import de.amos.apachepulsarui.domain.Topic;
import de.amos.apachepulsarui.parser.TopicParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;
    private final NamespaceService namespaceService;

    public List<Topic> getAllTopics() {
        List<Namespace> namespaces = namespaceService.getAll();
        return namespaces.stream()
                .flatMap(namespace -> this.getByNamespace(namespace).stream())
                .toList();
    }

    public List<Topic> getByNamespace(Namespace namespace, int maxCount) {
        return this.sublistOfMaxSize(this.getByNamespace(namespace), maxCount);
    }

    public boolean createNewTopic(String topic) {
        try {
            pulsarAdmin.topics().createNonPartitionedTopic(topic);
            return true;
        } catch (PulsarAdminException e) {
            log.error("Could not create new topic %s. E: %s".formatted(topic, e));
        }
        return false;
    }

    public boolean isValidTopic(String topic) {
        return TopicName.isValid(topic);
    }

    private List<Topic> getByNamespace(Namespace namespace) {
        try {
            return pulsarAdmin.topics()
                    .getList(namespace.getId()).stream()
                    .map(TopicParser::fromString)
                    .map(this::enrichWithSubscriptions)
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch topics of namespace %s. E: %s".formatted(namespace.getId(), e));
            return List.of();
        }
    }

    private Topic enrichWithSubscriptions(Topic topic) {
        try {
            return topic.toBuilder()
                    .subscriptions(pulsarAdmin.topics().getSubscriptions(topic.getName()))
                    .build();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch subscriptions of topic %s. E: %s".formatted(topic, e));
            return topic;
        }
    }

    private List<Topic> sublistOfMaxSize(List<Topic> list, int maxCount) {
        return list.subList(0, Math.min(list.size(), maxCount));
    }

}