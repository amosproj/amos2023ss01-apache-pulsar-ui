/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;

import java.util.List;

@Data
@Builder
public class ClusterDto {

    private String name;

    private List<TenantDto> tenants;

	private List<String> brokers;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTenants;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfNamespaces;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfTopics;

	@Setter(AccessLevel.PRIVATE)
	private int amountOfBrokers;

	private String brokerServiceUrl;

	private String serviceUrl;

	/**
	 * Set's the list of brokers, and it's size (amountOfBrokers) for this cluster.
	 */
	public void setBrokers(List<String> brokers) {
		this.brokers = brokers;
		this.amountOfBrokers = brokers.size();
	}

}
