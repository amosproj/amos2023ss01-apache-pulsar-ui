/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TopicDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;

    public List<TopicDto> getByNamespace(NamespaceDto namespace, int maxCount) {
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

    public List<TopicDto> getByNamespace(NamespaceDto namespace) {
        try {

            return pulsarAdmin.topics()
                    .getList(namespace.getId()).stream()
                    .map(this::createTopicDto)
                    .toList();

        } catch (PulsarAdminException e) {
            log.error("Could not fetch topics of namespace %s. E: %s".formatted(namespace.getId(), e));
            return List.of();
        }
    }

    private TopicDto createTopicDto(String completeTopicName) {
        return TopicDto.createTopicDto(completeTopicName, this.getTopicStats(completeTopicName), this.getOwnerBroker(completeTopicName));
    }

    private TopicStats getTopicStats(String fullTopicName) {
        try {
            return pulsarAdmin.topics().getStats(fullTopicName);
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    private String getOwnerBroker(String fullTopicName) {
        try {
            return pulsarAdmin.lookups().lookupTopic(fullTopicName);
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }


    private List<TopicDto> sublistOfMaxSize(List<TopicDto> list, int maxCount) {
        return list.subList(0, Math.min(list.size(), maxCount));
    }

}
