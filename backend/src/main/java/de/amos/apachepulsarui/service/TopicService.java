/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.*;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.apache.pulsar.common.schema.SchemaInfo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;

    @Cacheable("topics.allForTopics")
    public List<TopicDto> getAllForTopics(List<String> topics) {
        return topics.stream()
                .filter(this::exists)
                .map(topic -> TopicDto.create(topic, getTopicStats(topic)))
                .toList();
    }

    @Cacheable("topics.allForNamespace")
    public List<TopicDto> getAllForNamespaces(List<String> namespaces) {
        return namespaces.stream()
                .map(this::getAllForNamespace)
                .flatMap(topics -> getAllForTopics(topics).stream())
                .toList();
    }

    @Cacheable("topics.detail")
    public TopicDetailDto getTopicDetails(String topicName) throws PulsarApiException {
        return TopicDetailDto.create(
                topicName,
                getTopicStats(topicName),
                getOwnerBroker(topicName),
                getSchemasOfTopic(topicName)
        );
    }

    /**
     * @param namespace The namespace you want to get a list of all topics for.
     * @return A list of topics (their fully qualified names).
     */
    public List<String> getAllForNamespace(String namespace) {
        try {
            return pulsarAdmin.topics().getList(namespace);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch topics of namespace '%s'".formatted(namespace), e);
        }
    }

    private TopicStats getTopicStats(String topicName) throws PulsarApiException {
        try {
            return pulsarAdmin.topics().getStats(topicName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch topic stats for topic '%s'".formatted(topicName), e);
        }
    }

    private String getOwnerBroker(String topicName) throws PulsarApiException {
        try {
            return pulsarAdmin.lookups().lookupTopic(topicName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch owner broker for topic '%s'".formatted(topicName), e);
        }
    }

    private List<SchemaInfoDto> getSchemasOfTopic(String topicName) {
        try {
            return pulsarAdmin.schemas().getAllSchemas(topicName).stream()
                    .map(schemaInfo -> {
                        Long versionBySchemaInfo = getVersionBySchemaInfo(topicName, schemaInfo);
                        return SchemaInfoDto.create(schemaInfo, versionBySchemaInfo);
                    })
                    .toList();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch all schemas for topic %s".formatted(topicName), e);
        }
    }

    private Long getVersionBySchemaInfo(String topicName, SchemaInfo schemaInfo) {
        try {
            return pulsarAdmin.schemas().getVersionBySchema(topicName, schemaInfo);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch version by schema info %s for topic %s".formatted(schemaInfo.getName(), topicName),
                    e
            );
        }
    }

    public ProducerDto getProducerByTopic(String topic, String producer) {
        TopicStats topicStats = getTopicStats(topic);
        return ProducerDto.create(topicStats, producer);
    }

    public SubscriptionDto getSubscriptionByTopic(String topic, String subscription) {
        TopicStats topicStats = getTopicStats(topic);
        return SubscriptionDto.create(topicStats, subscription);
    }

    public ConsumerDto getConsumerByTopic(String topic, String consumer) {
        TopicStats topicStats = getTopicStats(topic);
        return ConsumerDto.create(topicStats, consumer);
    }

    private boolean exists(String topic) {
        TopicName topicName = TopicName.get(topic);
        try {
            return pulsarAdmin.topics().getList(topicName.getNamespace()).contains(topicName.toString());
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not check if topic %s is part of namespace %s".formatted(topicName.toString(), topicName.getNamespace()),
                    e
            );
        }
    }

    public List<TopicDto> getTopicsForProducer(List<TopicDto> topics, String producer) {
        return topics.stream()
                .filter(topicDto -> topicDto.getProducers().contains(producer))
                .toList();
    }

    public List<TopicDto> getTopicsForSubscriptions(List<TopicDto> topics, List<String> subscriptions) {
        return topics.stream()
                .filter(topic -> topic.getSubscriptions().stream().anyMatch(subscriptions::contains))
                .toList();
    }

}
