/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.naming.TopicName;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TopicDto {

    private String name;

	private String namespace;

	private String tenant;

    public static TopicDto create(String completeTopicName) {
        TopicName topicName = TopicName.get(completeTopicName);
		TopicDto topicDetailDto = new TopicDto();
		topicDetailDto.name = topicName.toString();
		topicDetailDto.namespace = topicName.getNamespace();
		topicDetailDto.tenant = topicName.getTenant();

		return topicDetailDto;
    }
}
