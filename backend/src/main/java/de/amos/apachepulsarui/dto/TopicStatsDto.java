/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.SubscriptionStats;
import org.apache.pulsar.common.policies.data.TopicStats;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static de.amos.apachepulsarui.dto.SubscriptionDto.createSubscriptionDto;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class TopicStatsDto {

    private List<SubscriptionDto> subscriptions;

    private List<ProducerDto> producers;

    private long numberSubscriptions;

    private long numberProducers;

    private long producedMesages;

    private long consumedMessages;

    private double averageMessageSize;

    private long storageSize;

    public static TopicStatsDto createTopicStatsDto(TopicStats topicStats) {
        List<SubscriptionDto> subscriptionDtos = getSubscriptions(topicStats);
        List<ProducerDto> producerDtos = getProducers(topicStats);

       return TopicStatsDto.builder()
                .subscriptions(subscriptionDtos)
                .producers(producerDtos)
                .numberSubscriptions(subscriptionDtos.size())
                .numberProducers(producerDtos.size())
                .producedMesages(topicStats.getMsgInCounter())
                .consumedMessages(topicStats.getMsgOutCounter())
                .averageMessageSize(topicStats.getAverageMsgSize())
                .storageSize(topicStats.getStorageSize())
                .build();

    }

    private static List<ProducerDto> getProducers(TopicStats topicStats) {
        List<PublisherStats> publisherStats = new ArrayList<>(topicStats.getPublishers());
        return publisherStats.stream()
                .map(ProducerDto::createProducerDto)
                .toList();
    }

    private static List<SubscriptionDto> getSubscriptions(TopicStats topicStats) {
        Map<String, SubscriptionStats> subscriptionStats = new HashMap<>(topicStats.getSubscriptions());
        List<SubscriptionDto> subscriptionDtos = new ArrayList<>();
        subscriptionStats.forEach((k, v) -> subscriptionDtos.add(createSubscriptionDto(k, getConsumers(v))));
        return subscriptionDtos;
    }

    private static List<ConsumerDto> getConsumers(SubscriptionStats subscriptionStats) {
        List<ConsumerStats> consumerStats = new ArrayList<>(subscriptionStats.getConsumers());
        return consumerStats
                .stream()
                .map(ConsumerDto::createConsumerDto)
                .toList();
    }


}
