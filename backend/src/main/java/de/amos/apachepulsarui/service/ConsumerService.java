/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.springframework.stereotype.Service;

@Service
public class ConsumerService {

    public ConsumerStats getConsumerStatsByTopic(TopicStats topicStats, String consumer) {
        return topicStats.getSubscriptions()
                .values()
                .stream().flatMap(
                        subscriptionStats -> subscriptionStats.getConsumers().stream()
                )
                .filter(c -> c.getConsumerName().equals(consumer))
                .findFirst()
                .orElseThrow();
    }
}
