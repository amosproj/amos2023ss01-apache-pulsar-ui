/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClusterDto {

    private String name;
    private long numberOfTenants;
    private long numberOfNamespaces;
    
    public static ClusterDto create(String name) {
        return ClusterDto.builder().name(name).build();
    }
}
