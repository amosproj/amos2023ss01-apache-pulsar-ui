/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.SubscriptionStats;

import java.util.List;
import java.util.Objects;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class SubscriptionDto {

    private String name;

    private ConsumerDto activeConsumer;

    private List<ConsumerDto> allConsumers;

    private List<MessageDto> messages;

    private long numberConsumers;

    private double msgAckRate;

    private long msgBacklog;

    private long msgOutCounter;

    public static SubscriptionDto create(SubscriptionStats subscriptionStats, List<MessageDto> messages, String name) {
        List<ConsumerDto> consumers = getConsumers(subscriptionStats);
        ConsumerDto active = consumers
                .stream()
                .filter(c -> Objects.equals(c.getName(), subscriptionStats.getActiveConsumerName()))
                .findFirst()
                .orElse(null);

        return SubscriptionDto.builder()
                .name(name)
                .messages(messages)
                .activeConsumer(active)
                .allConsumers(consumers)
                .msgAckRate(subscriptionStats.getMessageAckRate())
                .msgBacklog(subscriptionStats.getMsgBacklog())
                .msgOutCounter(builder().msgOutCounter)
                .build();
    }

    private static List<ConsumerDto> getConsumers(SubscriptionStats subscriptionStats) {
        return subscriptionStats.getConsumers()
                .stream()
                .map(ConsumerDto::create)
                .toList();

    }
}
