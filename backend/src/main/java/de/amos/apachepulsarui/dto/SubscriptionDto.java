/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder(access = AccessLevel.PRIVATE)
public class SubscriptionDto {

    private String name;

    private List<ConsumerDto> consumers;

    private long numberConsumers;

    public static SubscriptionDto createSubscriptionDto(String name, List<ConsumerDto> consumers) {
        return SubscriptionDto.builder()
                .name(name)
                .consumers(consumers)
                .numberConsumers(consumers.size())
                .build();
    }
}
