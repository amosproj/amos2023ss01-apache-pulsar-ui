/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.pulsar.common.policies.data.TenantInfo;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TenantDto {

    private String id;

    private List<NamespaceDto> namespaces;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfNamespaces;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTopics;

    private TenantInfo tenantInfo;

	public static TenantDto fromString(String tenantId) {
		TenantDto tenantDto = new TenantDto();
		tenantDto.id = tenantId;
		return tenantDto;
	}

	/**
	 * Set's the list of namespaces, and it's size (amountOfNamespaces) for this tenant.
	 * Additionally, it computes the amountOfTopics for this tenant.
	 */
	public void setNamespaces(List<NamespaceDto> namespaces) {
		this.namespaces = namespaces;
		this.amountOfNamespaces = namespaces.size();
		namespaces.forEach(namespace -> this.amountOfTopics += namespace.getAmountOfTopics());
	}

	/**
	 * @return An unmodifiable copy of the namespaces of this tenant.
	 */
	public List<NamespaceDto> getNamespaces() {
		return List.copyOf(namespaces);
	}

}
