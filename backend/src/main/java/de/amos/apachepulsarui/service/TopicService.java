/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;

    public boolean createNewTopic(String topic) {
        try {
            pulsarAdmin.topics().createNonPartitionedTopic(topic);
            return true;
        } catch (PulsarAdminException e) {
            log.error("Could not create new topic %s. E: %s".formatted(topic, e));
        }
        return false;
    }

    /**
     * @param namespace The namespace you want to get a list of all topics for.
     * @return A list of topics (their fully qualified names).
     */
    @Cacheable("topic.allNamesByNamespace")
    public List<String> getAllNamesByNamespace(String namespace) {
        return getByNamespace(namespace);
    }

    /**
     * @param namespace The namespace you want to get a list of all topics for.
     * @return A list of {@link TopicDto}'s including {@link de.amos.apachepulsarui.dto.TopicStatsDto} and
     * additional metadata.
     */
    @Cacheable("topic.allByNamespace")
    public List<TopicDto> getAllByNamespace(String namespace) {
        return getByNamespace(namespace).stream()
                .map(this::createTopicDto)
                .toList();
    }

    private List<String> getByNamespace(String namespace) {
        try {
            return pulsarAdmin.topics()
                    .getList(namespace).stream()
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch topics of namespace %s. E: %s".formatted(namespace, e));
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

}
