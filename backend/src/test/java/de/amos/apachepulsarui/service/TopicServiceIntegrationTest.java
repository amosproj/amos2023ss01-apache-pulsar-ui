/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @Test
    void getAllTopics_returnsCreatedTopics() {
        topicService.createNewTopic("greatTopic");
        var topics = topicService.getAllTopics();
        Assertions.assertThat(topics).containsExactly("persistent://public/default/greatTopic");
    }

}
