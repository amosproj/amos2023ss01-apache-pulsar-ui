/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.service.TopicService;
import net.bytebuddy.utility.RandomString;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.equalTo;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TopicController.class)
public class TopicControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    TopicService topicService;

    @MockBean
    TopicStats topicStats;

    @Test
    void getAllTopics_returnsAllTopics() throws Exception {

        List<TopicDto> topics = Stream.of(
                "persistent://public/default/tatooine",
                "non-persistent://fizz/foo/naboo",
                "persistent://buzz/bar/coruscant"
        ).map( values -> TopicDto.createTopicDto(values, topicStats, RandomString.make(1))).toList();

        Mockito.when(topicService.getAllTopics()).thenReturn(topics);

        mockMvc.perform(get("/topic")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[2].name", equalTo(topics.get(2).getName())));
    }
}
