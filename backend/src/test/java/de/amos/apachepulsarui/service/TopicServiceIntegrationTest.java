/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDto;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @Test
    void getAllTopics_returnsCreatedTopics() {
        topicService.createNewTopic("topic-service-integration-test");
        List<TopicDto> topics = topicService.getAllTopics();
        Assertions.assertThat(topics)
                .contains(TopicDto.fromString("persistent://public/default/topic-service-integration-test"));
    }

}
