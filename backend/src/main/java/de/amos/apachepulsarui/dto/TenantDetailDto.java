/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.TenantInfo;

import java.util.List;

@Data
@Builder
public class TenantDetailDto {

    private String name;
    private List<String> namespaces;
    private TenantInfo tenantInfo;

	public List<String> getNamespaces() {
		return List.copyOf(namespaces);
	}

}
