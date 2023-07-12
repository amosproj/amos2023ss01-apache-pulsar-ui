/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ClustersDto {

    private List<ClusterDto> clusters;
}
