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
public class TopicDto {

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
     * Converts a valid complete topic name (like "persistent://eu-tenant/hr/fizzbuzz" into a {@link TopicDto}.
     */
    public static TopicDto createTopicDto(String completeTopicName, TopicStats topicStats, String ownerBroker) {
        TopicName topicName = TopicName.get(completeTopicName);
		TopicDto topicDto = new TopicDto();
		topicDto.name = topicName.toString();
		topicDto.localName = topicName.getLocalName();
		topicDto.namespace = topicName.getNamespacePortion();
		topicDto.tenant = topicName.getTenant();
		topicDto.isPersistent = topicName.isPersistent();
		topicDto.ownerBroker = ownerBroker;
		topicDto.setTopicStatsDto(TopicStatsDto.createTopicStatsDto(topicStats));
		topicDto.producedMessages = topicDto.topicStatsDto.getProducedMesages();
		topicDto.consumedMessages = topicDto.topicStatsDto.getConsumedMessages();

		return topicDto;
    }

	public static TopicDto createTopicDtoWithMessages(String completeTopicName, TopicStats topicStats, String ownerBroker, List<MessageDto> messages) {
		TopicDto topicDto = createTopicDto(completeTopicName, topicStats, ownerBroker);
		topicDto.setMessagesDto(messages);
		return topicDto;
	}



}
