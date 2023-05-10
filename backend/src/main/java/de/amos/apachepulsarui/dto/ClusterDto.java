/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ClusterDto {

    private String id;

    private List<TenantDto> tenants;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTenants = 0;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfNamespaces = 0;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTopics = 0;

	public static ClusterDto fromString(String clusterId) {
		ClusterDto clusterDto = new ClusterDto();
		clusterDto.id = clusterId;
		return clusterDto;
	}

	/**
	 * Set's the list of tenants, and it's size (amountOfTenants) for this cluster.
	 */
	public void setTenants(List<TenantDto> tenants) {
		this.tenants = tenants;
		this.amountOfTenants = tenants.size();
		tenants.forEach(tenant -> {
			this.amountOfNamespaces += tenant.getAmountOfNamespaces();
			this.amountOfTopics += tenant.getAmountOfTopics();
		});
	}

	/**
	 * @return An unmodifiable copy of the tenants of this cluster.
	 */
	public List<TenantDto> getTenants() {
		return List.copyOf(tenants);
	}

}
