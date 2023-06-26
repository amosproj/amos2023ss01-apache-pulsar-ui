/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Data;
import org.apache.pulsar.common.policies.data.TenantInfo;

@Data
@Builder
public class TenantDto {

    private String name;

    private TenantInfo tenantInfo;

    private long numberOfNamespaces;

    private long numberOfTopics;


    public static TenantDto create(TenantInfo tenantInfo, String name) {
        return TenantDto.builder()
                .name(name)
                .tenantInfo(tenantInfo)
                .build();
    }
}
