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
public class ClusterDetailDto {

    private String name;
    private List<String> tenants;
	private List<String> brokers;
	@Setter(AccessLevel.PRIVATE)
	private int amountOfBrokers;
	private String brokerServiceUrl;
	private String serviceUrl;

}
