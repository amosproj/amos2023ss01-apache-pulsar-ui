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
public class ClusterDto {

    private String id;
    private List<TenantDto> tenants = List.of();

	public static ClusterDto fromString(String clusterId) {
		ClusterDto clusterDto = new ClusterDto();
		clusterDto.id = clusterId;
		return clusterDto;
	}

}
