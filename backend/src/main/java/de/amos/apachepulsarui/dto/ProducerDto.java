/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.PublisherStats;

@Data
@AllArgsConstructor
@Builder(access = AccessLevel.PRIVATE)
public class ProducerDto {

    private long id;

    private String name;

    //todo figure out how to get the amount of messages
    //private long amountOfMessages;

    private String address;

    private double averageMsgSize;

    private String clientVersion;

    private String connectedSince;

    public static ProducerDto create(PublisherStats publisherStats) {
        return ProducerDto.builder()
                .id(publisherStats.getProducerId())
                .name(publisherStats.getProducerName())
                //.amountOfMessages(numOfMsgs)
                .connectedSince(publisherStats.getConnectedSince())
                .address(publisherStats.getAddress())
                .averageMsgSize(publisherStats.getAverageMsgSize())
                .clientVersion(publisherStats.getClientVersion())
                .build();
    }
}
