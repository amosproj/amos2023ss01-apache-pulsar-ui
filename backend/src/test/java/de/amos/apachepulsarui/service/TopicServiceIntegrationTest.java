/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TopicDto;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.List;

public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @MockBean
    private TopicStats topicStats;

    @Test
    void getByNamespace_returnsCreatedTopics() {
        topicService.createNewTopic("topic-service-integration-test");
        List<TopicDto> topics = topicService.getByNamespace(NamespaceDto.fromString("public/default"));
        Assertions.assertThat(topics)
                .contains(TopicDto.createTopicDto("persistent://public/default/topic-service-integration-test", topicStats, "pulsar://localhost:6650"));
    }

}
