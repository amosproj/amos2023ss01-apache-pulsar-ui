/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.policies.data.BundlesData;
import org.apache.pulsar.common.policies.data.RetentionPolicies;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NamespaceDetailDto {

    private String name;
	private List<String> topics;
	private String tenant;
	private BundlesData bundlesData;
	private Integer messagesTTL;
	private RetentionPolicies retentionPolicies;

	public static NamespaceDetailDto create(
			String name,
			BundlesData bundlesData,
			Integer messagesTTL,
			RetentionPolicies retentionPolicies,
			List<String> topics
	) {
		NamespaceDetailDto namespaceDetailDto = new NamespaceDetailDto();
		namespaceDetailDto.name = name;
		namespaceDetailDto.bundlesData = bundlesData;
		namespaceDetailDto.messagesTTL = messagesTTL;
		namespaceDetailDto.retentionPolicies = retentionPolicies;
		namespaceDetailDto.topics = topics;
		return namespaceDetailDto;
	}

	public void setTopics(List<String> topics) {
		this.topics = topics;
	}

	public List<String> getTopics() {
		return List.copyOf(topics);
	}
}
