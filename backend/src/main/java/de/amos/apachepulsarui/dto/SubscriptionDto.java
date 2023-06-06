/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.SubscriptionStats;

import java.util.List;
import java.util.Objects;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class SubscriptionDto {

    private String name;

    private String activeConsumer;

    private List<String> inactiveConsumers;

    private List<MessageDto> messages;

    private long numberConsumers;

    private double msgAckRate;

    private long msgBacklog;

    private long backlogSize;

    private long msgOutCounter;

    private long bytesOutCounter;

    private boolean replicated;

    private String type;

    public static SubscriptionDto create(SubscriptionStats subscriptionStats, List<MessageDto> messages, String name) {
        List<String> consumers = getConsumers(subscriptionStats);
        String active = consumers.stream()
                .filter(c -> Objects.equals(c, subscriptionStats.getActiveConsumerName()))
                .findFirst()
                .orElse(null);
        List<String> inactive = consumers.stream()
                .filter(c -> !Objects.equals(c, subscriptionStats.getActiveConsumerName()))
                .toList();
        return SubscriptionDto.builder()
                .name(name)
                .messages(messages)
                .activeConsumer(active)
                .inactiveConsumers(inactive)
                .msgAckRate(subscriptionStats.getMessageAckRate())
                .msgBacklog(subscriptionStats.getMsgBacklog())
                .bytesOutCounter(subscriptionStats.getBytesOutCounter())
                .replicated(subscriptionStats.isReplicated())
                .msgOutCounter(subscriptionStats.getMsgOutCounter())
                .type(subscriptionStats.getType())
                .backlogSize(subscriptionStats.getBacklogSize())
                .build();
    }

    private static List<String> getConsumers(SubscriptionStats subscriptionStats) {
        return subscriptionStats.getConsumers()
                .stream()
                .map(ConsumerStats::getConsumerName)
                .toList();

    }
}
