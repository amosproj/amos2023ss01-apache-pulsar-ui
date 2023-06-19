/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.Builder;
import lombok.Value;
import org.apache.pulsar.common.schema.SchemaInfo;
import org.apache.pulsar.common.schema.SchemaType;

import java.sql.Timestamp;
import java.util.Map;

@Value
@Builder
public class SchemaInfoDto {

    String name;
    long version;
    SchemaType type;
    Map<String, String> properties;
    String schemaDefinition;
    Timestamp timestamp;

    public static SchemaInfoDto create(SchemaInfo schemaInfo, Long version) {
        return SchemaInfoDto.builder()
                .name(schemaInfo.getName())
                .version(version)
                .type(schemaInfo.getType())
                .properties(schemaInfo.getProperties())
                .schemaDefinition(schemaInfo.getSchemaDefinition())
                .timestamp(new Timestamp(schemaInfo.getTimestamp()))
                .build();
    }

}
