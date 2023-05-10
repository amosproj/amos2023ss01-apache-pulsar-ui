/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class NamespaceDto {

    private String id;
    private List<TopicDto> topics = List.of();

	public static NamespaceDto fromString(String namespaceId) {
		NamespaceDto namespaceDto = new NamespaceDto();
		namespaceDto.setId(namespaceId);
		return namespaceDto;
	}

}
