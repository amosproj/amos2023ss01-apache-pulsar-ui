/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.*;
import org.apache.pulsar.common.policies.data.PublisherStats;

import java.util.List;

@Data
@AllArgsConstructor
@Builder(access = AccessLevel.PRIVATE)
public class ProducerDto {

    private String name;

    private List<MessageDto> messagesDto;

    private long amountOfMessages;

    public static ProducerDto createProducerDto(PublisherStats publisherStats, List<MessageDto> messages) {
        return ProducerDto.builder()
                .name(publisherStats.getProducerName())
                .messagesDto(messages)
                .amountOfMessages(messages.size())
                .build();
    }
}
