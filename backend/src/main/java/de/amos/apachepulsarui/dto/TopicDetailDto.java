/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TopicStats;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
 import java.util.List;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TopicDetailDto {

    private String name;
    private String localName;
    private String namespace;
    private String tenant;
    private boolean isPersistent;
    private String ownerBroker;
    private TopicStatsDto topicStatsDto;
    private List<SchemaInfoDto> schemaInfos = new ArrayList<>();

    public static TopicDetailDto create(
            String completeTopicName,
            TopicStats topicStats,
            String ownerBroker,
            List<SchemaInfoDto> schemaInfos
    ) {
        TopicName topicName = TopicName.get(completeTopicName);
        TopicDetailDto topicDetailDto = new TopicDetailDto();

        topicDetailDto.name = topicName.toString();
        topicDetailDto.localName = topicName.getLocalName();
        topicDetailDto.namespace = topicName.getNamespacePortion();
        topicDetailDto.tenant = topicName.getTenant();
        topicDetailDto.isPersistent = topicName.isPersistent();
        topicDetailDto.ownerBroker = ownerBroker;

        topicDetailDto.setTopicStatsDto(TopicStatsDto.createTopicStatsDto(topicStats));

        // we want to put the latest schema version on top of the list
        if (!schemaInfos.isEmpty()) {
            List<SchemaInfoDto> schemaInfosSorted = schemaInfos.stream()
                    .sorted(Comparator.comparing(SchemaInfoDto::getVersion, Collections.reverseOrder()))
                    .toList();
            topicDetailDto.setSchemaInfos(schemaInfosSorted);
        }

        return topicDetailDto;
    }
}
