/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.*;
import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.TopicStats;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder(access = AccessLevel.PRIVATE)
public class ConsumerDto {

    private String name;
    private String address;
    private long availablePermits;
    private long bytesOutCounter;
    private String clientVersion;
    private String connectedSince;
    private long lastAckedTimestamp;
    private long lastConsumedTimestamp;
    private long messageOutCounter;
    private int unackedMessages;
    private boolean blockedConsumerOnUnackedMsgs;

    public static ConsumerDto create(TopicStats topicStats, String consumer) {
        ConsumerStats consumerStats = getConsumerStatsByTopic(topicStats, consumer);
        return ConsumerDto.builder()
                .name(consumerStats.getConsumerName())
                .address(consumerStats.getAddress())
                .availablePermits(consumerStats.getAvailablePermits())
                .bytesOutCounter(consumerStats.getBytesOutCounter())
                .clientVersion(consumerStats.getClientVersion())
                .connectedSince(consumerStats.getConnectedSince())
                .lastAckedTimestamp(consumerStats.getLastAckedTimestamp())
                .lastConsumedTimestamp(consumerStats.getLastConsumedTimestamp())
                .messageOutCounter(consumerStats.getMsgOutCounter())
                .unackedMessages(consumerStats.getUnackedMessages())
                .blockedConsumerOnUnackedMsgs(consumerStats.isBlockedConsumerOnUnackedMsgs())
                .build();
    }


    private static ConsumerStats getConsumerStatsByTopic(TopicStats topicStats, String consumer) {
        return topicStats.getSubscriptions()
                .values().stream()
                .flatMap(subscriptionStats -> subscriptionStats.getConsumers().stream())
                .filter(c -> c.getConsumerName().equals(consumer))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No ConsumerStats found for " + consumer));
    }
}
