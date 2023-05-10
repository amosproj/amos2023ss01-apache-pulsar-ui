/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.PublisherStats;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class ProducerDto {

    private String name;

    public static ProducerDto createProducerDto(PublisherStats publisherStats) {
        return ProducerDto.builder().name(publisherStats.getProducerName()).build();
    }
}
