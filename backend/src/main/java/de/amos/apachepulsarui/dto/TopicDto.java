/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TopicStats;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TopicDto {

    private String name;

	private String localName;

	private String namespace;

	private String tenant;

	private boolean isPersistent;

	private TopicStatsDto topicStatsDto;


    /**
     * Converts a valid complete topic name (like "persistent://eu-tenant/hr/fizzbuzz" into a {@link TopicDto}.
     */
    public static TopicDto createTopicDto(String completeTopicName, TopicStats topicStats) {
        TopicName topicName = TopicName.get(completeTopicName);
		TopicDto topicDto = new TopicDto();
		topicDto.name = topicName.toString();
		topicDto.localName = topicName.getLocalName();
		topicDto.namespace = topicName.getNamespacePortion();
		topicDto.tenant = topicName.getTenant();
		topicDto.isPersistent = topicName.isPersistent();
		topicDto.setTopicStatsDto(TopicStatsDto.createTopicStatsDto(topicStats));

		return topicDto;
    }



}
