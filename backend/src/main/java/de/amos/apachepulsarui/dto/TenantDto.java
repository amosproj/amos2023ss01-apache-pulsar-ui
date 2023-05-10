/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Value;
import org.apache.pulsar.common.policies.data.TenantInfo;

import java.util.List;

@Value
@Builder(toBuilder = true)
public class TenantDto {

    String id;
    List<NamespaceDto> namespaces;
    TenantInfo tenantInfo;

}
