/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Value;
import org.apache.pulsar.common.naming.TopicName;

import java.util.List;

@Value
@Builder(toBuilder = true)
public class TopicDto {

    String name;

    String localName;

    String namespace;

    String tenant;

    boolean isPersistent;

    @Builder.Default
    List<String> subscriptions = List.of();

    /**
     * Converts a valid complete topic name (like "persistent://eu-tenant/hr/fizzbuzz" into a {@link TopicDto}.
     */
    public static TopicDto fromString(String completeTopicName) {
        TopicName topicName = TopicName.get(completeTopicName);
        return TopicDto.builder()
                .name(topicName.toString())
                .localName(topicName.getLocalName())
                .namespace(topicName.getNamespacePortion())
                .tenant(topicName.getTenant())
                .isPersistent(topicName.isPersistent())
                .build();
    }

}
