/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.naming.NamespaceName;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NamespaceDto {

    private String id;

	private String tenant;

	private long numberOfTopics;

	public static NamespaceDto fromString(String namespaceId) {
		NamespaceDto namespaceDto = new NamespaceDto();
		namespaceDto.setId(namespaceId);
		namespaceDto.setTenant(NamespaceName.get(namespaceId).getTenant());
		return namespaceDto;
	}
}
