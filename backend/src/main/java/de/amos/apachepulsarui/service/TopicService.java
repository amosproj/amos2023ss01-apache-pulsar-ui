/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.client.api.MessageId;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.Reader;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static de.amos.apachepulsarui.dto.ProducerDto.createProducerDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;

    private final MessageService messageService;

    private final PulsarClient pulsarClient;

    /**
     * @param name The Name of the Topic you want to get a list of all topics for.
     * @return A {@link TopicDto}'s including {@link TopicStatsDto}, List of {@link MessageDto} and
     * additional metadata.
     */
    public TopicDto getTopicWithMessagesByName(String name) {
        List<MessageDto> messages = messageService.peekMessages(name);

        return TopicDto.createTopicDtoWithMessages(name,
                getTopicStats(name),
                getOwnerBroker(name),
                messages);
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

    public ProducerDto getProducerByTopic(String topic, String producer) {
        TopicStats topicStats = getTopicStats(topic);
        PublisherStats publisherStats = topicStats.getPublishers().stream()
                .filter(ps -> Objects.equals(ps.getProducerName(), producer))
                .findFirst().orElseThrow();
        return createProducerDto(publisherStats, getMessagesByProducer(topic, producer));
    }


    private List<Message<byte[]>> peekAllMessagesByTopic(String topic) {
        try {
            Reader<byte[]> reader = pulsarClient.newReader()
                    .topic(topic)
                    .startMessageId(MessageId.latest)
                    .create();

            List<Message<byte[]>> messages = new ArrayList<>();
            while (reader.hasMessageAvailable()) {
                messages.add(reader.readNext());
            }
            reader.close();
            return messages;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    private List<MessageDto> getMessagesByProducer(String topic, String producer) {
        return peekAllMessagesByTopic(topic).stream()
                .filter(message -> Objects.equals(message.getProducerName(), producer))
                .map(message -> MessageDto.fromExistingMessage(message, null))
                .toList();

    }

    public SubscriptionDto getSubscriptionByTopic(String topic, String subscription) {
        return SubscriptionDto.createSubscriptionDto(getTopicStats(topic).getSubscriptions().get(subscription), subscription);
    }

}
