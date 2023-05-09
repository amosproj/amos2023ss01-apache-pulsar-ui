/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Topic;
import de.amos.apachepulsarui.parser.TopicParser;
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
        List<Topic> topics = topicService.getAllTopics();
        Assertions.assertThat(topics)
                .contains(TopicParser.fromString("persistent://public/default/topic-service-integration-test"));
    }

}
