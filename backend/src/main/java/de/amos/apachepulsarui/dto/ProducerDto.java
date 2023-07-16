/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.*;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.TopicStats;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(access = AccessLevel.PRIVATE)
public class ProducerDto {

    private long id;
    private String name;
    private String address;
    private double averageMsgSize;
    private String clientVersion;
    private String connectedSince;

    public static ProducerDto create(TopicStats topicStats, String producer) {
        PublisherStats publisherStats = getPublisherStats(topicStats, producer);
        return ProducerDto.builder()
                .id(publisherStats.getProducerId())
                .name(publisherStats.getProducerName())
                .connectedSince(publisherStats.getConnectedSince())
                .address(publisherStats.getAddress())
                .averageMsgSize(publisherStats.getAverageMsgSize())
                .clientVersion(publisherStats.getClientVersion())
                .build();
    }

    private static PublisherStats getPublisherStats(TopicStats topicStats, String producer) {
        return topicStats.getPublishers().stream()
                .filter(ps -> Objects.equals(ps.getProducerName(), producer))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No PublisherStats found for " + producer));
    }

}
