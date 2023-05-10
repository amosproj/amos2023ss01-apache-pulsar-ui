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

	private List<String> brokers;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTenants = 0;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfNamespaces = 0;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTopics = 0;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfBrokers = 0;

	private String brokerServiceUrl;

	private String serviceUrl;


	public static ClusterDto fromString(String clusterId) {
		ClusterDto clusterDto = new ClusterDto();
		clusterDto.id = clusterId;
		return clusterDto;
	}

	/**
	 * Set's the list of tenants, and it's size (amountOfTenants) for this cluster.
	 * Additionally, it computes the amountOfNamespaces and amountOfTopics for this cluster.
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
	 * Set's the list of brokers, and it's size (amountOfBrokers) for this cluster.
	 */
	public void setBrokers(List<String> brokers) {
		this.brokers = brokers;
		this.amountOfBrokers = brokers.size();
	}

	/**
	 * @return An unmodifiable copy of the tenants of this cluster.
	 */
	public List<TenantDto> getTenants() {
		return List.copyOf(tenants);
	}

	/**
	 * @return An unmodifiable copy of the brokers of this cluster.
	 */
	public List<String> getBrokers() {
		return List.copyOf(brokers);
	}

}
