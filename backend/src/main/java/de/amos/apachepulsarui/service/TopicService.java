/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.ConsumerDto;
import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.dto.ProducerDto;
import de.amos.apachepulsarui.dto.SchemaInfoDto;
import de.amos.apachepulsarui.dto.SubscriptionDto;
import de.amos.apachepulsarui.dto.TopicDetailDto;
import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.dto.TopicStatsDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;

import static de.amos.apachepulsarui.dto.ProducerDto.create;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final PulsarAdmin pulsarAdmin;

    private final MessageService messageService;

    private final ConsumerService consumerService;

    public List<TopicDto> getAllForTopics(List<String> topics) {
        return topics.stream()
                .map(TopicDto::create)
                .filter(this::exists)
                .toList();
    }

    public List<TopicDto> getAllForNamespaces(List<String> namespaces) {
        return namespaces.stream()
                .map(this::getByNamespace)
                .flatMap(topics -> getAllForTopics(topics).stream())
                .toList();
    }

    /**
     * @param namespace The namespace you want to get a list of all topics for.
     * @return A list of topics (their fully qualified names).
     */
    public List<String> getAllByNamespace(String namespace) {
        return getByNamespace(namespace);
    }

    private List<String> getByNamespace(String namespace) throws PulsarApiException {
        try {
            return pulsarAdmin.topics().getList(namespace);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch topics of namespace '%s'".formatted(namespace), e);
        }
    }

    public void createNewTopic(String topic) throws PulsarApiException {
        try {
            pulsarAdmin.topics().createNonPartitionedTopic(topic);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not create new topic '%s'".formatted(topic), e);
        }
    }

    /**
     * @param topicName The Name of the Topic you want to get detailed information about
     * @return A {@link TopicDetailDto}'s including {@link TopicStatsDto}, List of {@link MessageDto} and
     * additional metadata.
     */
    public TopicDetailDto getTopicDetails(String topicName) throws PulsarApiException {
        return TopicDetailDto.create(
                topicName,
                getTopicStats(topicName),
                getOwnerBroker(topicName),
                getSchemasOfTopic(topicName)
        );
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
                    .map(SchemaInfoDto::create)
                    .toList();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch all schemas for topic %s".formatted(topicName), e);
        }
    }

    public ProducerDto getProducerByTopic(String topic, String producer) {
        TopicStats topicStats = getTopicStats(topic);
        PublisherStats publisherStats = topicStats.getPublishers().stream()
                .filter(ps -> Objects.equals(ps.getProducerName(), producer))
                .findFirst().orElseThrow();
        return create(publisherStats, getMessagesByProducer(topic, topicStats.getSubscriptions().keySet(), producer));
    }

    private List<MessageDto> getMessagesByProducer(String topic, Set<String> subscriptions, String producer) {
        return subscriptions.stream()
                .flatMap(s -> messageService.peekMessages(topic, s).stream())
                .filter(distinctByKey(MessageDto::getMessageId))
                .filter(message -> Objects.equals(message.getProducer(), producer))
                .toList();
    }

    public SubscriptionDto getSubscriptionByTopic(String topic, String subscription) {
        List<MessageDto> messages = messageService.peekMessages(topic, subscription);
        return SubscriptionDto.create(getTopicStats(topic).getSubscriptions().get(subscription), messages, subscription);
    }

    //source: https://www.baeldung.com/java-streams-distinct-by
    public static <T> Predicate<T> distinctByKey(
            Function<? super T, ?> keyExtractor) {

        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    public ConsumerDto getConsumerByTopic(String topic, String consumer) {
        TopicStats topicStats = getTopicStats(topic);
        ConsumerStats consumerStats = consumerService.getConsumerStatsByTopic(topicStats, consumer);
        return ConsumerDto.create(consumerStats);
    }

    private boolean exists(TopicDto topic) {
        try {
            return pulsarAdmin.topics().getList(topic.getNamespace()).contains(topic.getName());
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not check if topic %s is part of namespace %s".formatted(topic.getName(), topic.getNamespace()),
                    e
            );
        }
    }
}
