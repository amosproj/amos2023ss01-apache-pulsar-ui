/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.pulsar.common.policies.data.BundlesData;
import org.apache.pulsar.common.policies.data.RetentionPolicies;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NamespaceDto {

    private String id;

	private List<String> topics;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTopics = 0;

	private BundlesData bundlesData;

	private Integer messagesTTL;

	private RetentionPolicies retentionPolicies;

	public static NamespaceDto fromString(String namespaceId) {
		NamespaceDto namespaceDto = new NamespaceDto();
		namespaceDto.setId(namespaceId);
		return namespaceDto;
	}

	public void setTopics(List<String> topics) {
		this.topics = topics;
		this.amountOfTopics = topics.size();
	}

	/**
	 * @return An unmodifiable copy of the topics of this namespace.
	 */
	public List<String> getTopics() {
		return List.copyOf(topics);
	}

}
