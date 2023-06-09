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

    public static TopicDto create(String completeTopicName) {
        TopicName topicName = TopicName.get(completeTopicName);
		TopicDto topicDetailDto = new TopicDto();
		topicDetailDto.name = topicName.toString();
		topicDetailDto.localName = topicName.getLocalName();
		topicDetailDto.namespace = topicName.getNamespacePortion();
		topicDetailDto.tenant = topicName.getTenant();

		return topicDetailDto;
    }
}
