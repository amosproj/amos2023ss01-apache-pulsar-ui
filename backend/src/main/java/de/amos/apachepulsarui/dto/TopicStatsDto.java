/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.TopicStats;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class TopicStatsDto {

    private Set<String> subscriptions;

    private List<String> producers;

    private long numberSubscriptions;

    private long numberProducers;

    private long producedMesages;

    private long consumedMessages;

    private double averageMessageSize;

    private long storageSize;

    public static TopicStatsDto createTopicStatsDto(TopicStats topicStats) {

        Set<String> subscriptions = topicStats.getSubscriptions().keySet();
        List<String> producers = getProducers(topicStats);

       return TopicStatsDto.builder()
                .subscriptions(subscriptions)
                .producers(producers)
                .numberSubscriptions(subscriptions.size())
                .numberProducers(producers.size())
                .producedMesages(topicStats.getMsgInCounter())
                .consumedMessages(topicStats.getMsgOutCounter())
                .averageMessageSize(topicStats.getAverageMsgSize())
                .storageSize(topicStats.getStorageSize())
                .build();

    }

    public static List<String> getProducers(TopicStats topicStats) {
        List<PublisherStats> publisherStats = new ArrayList<>(topicStats.getPublishers());
        return publisherStats.stream()
                .map(PublisherStats::getProducerName)
                .toList();
    }






}
