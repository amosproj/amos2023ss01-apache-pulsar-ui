/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.policies.data.TenantInfo;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TenantDetailDto {

    private String name;
    private List<String> namespaces;
    private TenantInfo tenantInfo;

	public List<String> getNamespaces() {
		return List.copyOf(namespaces);
	}

	public static TenantDetailDto create(String name, TenantInfo tenantInfo, List<String> namespaces) {
		TenantDetailDto tenantDetailDto = new TenantDetailDto();
		tenantDetailDto.name = name;
		tenantDetailDto.tenantInfo = tenantInfo;
		tenantDetailDto.namespaces = namespaces;
		return tenantDetailDto;
	}

}
