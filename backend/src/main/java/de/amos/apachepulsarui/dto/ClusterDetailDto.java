/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.pulsar.common.policies.data.ClusterData;

import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ClusterDetailDto {

    private String name;
    private List<String> tenants;
	private List<String> brokers;
	@Setter(AccessLevel.PRIVATE)
	private int amountOfBrokers;
	private String brokerServiceUrl;
	private String serviceUrl;

	public static ClusterDetailDto create(
			String name,
			List<String> activeBrokers,
			List<String> tenants,
			ClusterData clusterData
	) {
		ClusterDetailDto clusterDetailDto = new ClusterDetailDto();
		clusterDetailDto.name = name;
		clusterDetailDto.serviceUrl = clusterDetailDto.getServiceUrl();
		clusterDetailDto.brokerServiceUrl = clusterDetailDto.getBrokerServiceUrl();
		clusterDetailDto.brokers = activeBrokers;
		clusterDetailDto.amountOfBrokers = activeBrokers.size();
		clusterDetailDto.tenants = tenants;
		return clusterDetailDto;
	}

}
