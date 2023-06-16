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

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TopicDetailDto {

    private String name;

	private String localName;

	private String namespace;

	private String tenant;

	private boolean isPersistent;

	private String ownerBroker;

	private TopicStatsDto topicStatsDto;

	private long producedMessages;

	private long consumedMessages;

	private List<MessageDto> messagesDto = new ArrayList<>();


	/**
     * Converts a valid complete topic name (like "persistent://eu-tenant/hr/fizzbuzz" into a {@link TopicDetailDto}.
     */
    public static TopicDetailDto create(String completeTopicName, TopicStats topicStats, String ownerBroker) {
        TopicName topicName = TopicName.get(completeTopicName);
		TopicDetailDto topicDetailDto = new TopicDetailDto();
		topicDetailDto.name = topicName.toString();
		topicDetailDto.localName = topicName.getLocalName();
		topicDetailDto.namespace = topicName.getNamespacePortion();
		topicDetailDto.tenant = topicName.getTenant();
		topicDetailDto.isPersistent = topicName.isPersistent();
		topicDetailDto.ownerBroker = ownerBroker;
		topicDetailDto.setTopicStatsDto(TopicStatsDto.createTopicStatsDto(topicStats));
		topicDetailDto.producedMessages = topicDetailDto.topicStatsDto.getProducedMesages();
		topicDetailDto.consumedMessages = topicDetailDto.topicStatsDto.getConsumedMessages();

		return topicDetailDto;
    }
}
