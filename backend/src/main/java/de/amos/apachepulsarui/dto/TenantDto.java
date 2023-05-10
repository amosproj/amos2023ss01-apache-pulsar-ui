/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import java.util.List;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.policies.data.TenantInfo;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TenantDto {

    private String id;
    private List<NamespaceDto> namespaces;
    private TenantInfo tenantInfo;

	public static TenantDto fromString(String tenantId) {
		TenantDto tenantDto = new TenantDto();
		tenantDto.id = tenantId;
		return tenantDto;
	}

}
