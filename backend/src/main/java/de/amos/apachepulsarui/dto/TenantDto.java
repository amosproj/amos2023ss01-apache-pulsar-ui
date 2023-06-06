/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;
import org.apache.pulsar.common.policies.data.TenantInfo;

import java.util.List;

@Data
@Builder
public class TenantDto {

    private String name;

    private List<String> namespaces;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfNamespaces;

    private TenantInfo tenantInfo;

	/**
	 * @return An unmodifiable copy of the namespaces of this tenant.
	 */
	public List<String> getNamespaces() {
		return List.copyOf(namespaces);
	}

}
