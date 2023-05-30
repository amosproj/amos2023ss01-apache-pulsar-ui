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

    public static ConsumerDto create(ConsumerStats consumerStats) {
        return ConsumerDto.builder().name(consumerStats.getConsumerName()).build();
    }


}
