/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.TopicStats;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Data
@Builder
public class TopicDto {

    private String name;

    private String namespace;

    private String tenant;

    private Set<String> subscriptions;

    private List<String> producers;

    public static TopicDto create(String completeTopicName, TopicStats topicStats) {
        Set<String> subscriptions = topicStats.getSubscriptions().keySet();
        List<String> producers = getProducers(topicStats);

        TopicName topicName = TopicName.get(completeTopicName);
        return TopicDto.builder()
                .name(topicName.toString())
                .namespace(topicName.getNamespace())
                .tenant(topicName.getTenant())
                .producers(producers)
                .subscriptions(subscriptions)
                .build();
    }

    private static List<String> getProducers(TopicStats topicStats) {
        List<PublisherStats> publisherStats = new ArrayList<>(topicStats.getPublishers());
        return publisherStats.stream()
                .map(PublisherStats::getProducerName)
                .toList();
    }
}
