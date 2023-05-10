/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder(toBuilder = true)
public class ClusterDto {

    private String id;
    private List<TenantDto> tenants;

    public ClusterDto withTenants(List<TenantDto> tenants) {
        return this.toBuilder()
                .tenants(tenants)
                .build();
    }

}
