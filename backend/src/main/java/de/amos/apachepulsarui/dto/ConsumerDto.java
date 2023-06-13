/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.ConsumerStats;

@Data
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

    public static ConsumerDto create(ConsumerStats consumerStats) {
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
}
