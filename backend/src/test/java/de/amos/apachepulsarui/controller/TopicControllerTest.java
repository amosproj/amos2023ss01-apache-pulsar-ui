/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.ProducerDto;
import de.amos.apachepulsarui.dto.SubscriptionDto;
import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import de.amos.apachepulsarui.service.TopicService;
import net.bytebuddy.utility.RandomString;
import org.apache.pulsar.common.policies.data.SubscriptionStats;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.Matchers.equalTo;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TopicController.class)
public class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TopicService topicService;

    @MockBean
    private NamespaceService namespaceService;

    @MockBean
    TenantService tenantService;

    @MockBean
    private TopicStats topicStats;

    @MockBean
    private SubscriptionStats subscriptionStats;

    @Test
    void returnAllTopicsByNamespace() throws Exception {

        List<TopicDto> topics = Stream.of(
                "persistent://public/default/tatooine",
                "non-persistent://public/default/naboo",
                "persistent://public/default/coruscant"
        ).map(values -> TopicDto.createTopicDto(values, topicStats, RandomString.make(1))).toList();

        when(topicService.getAllByNamespace("public/default")).thenReturn(topics);

        mockMvc.perform(get("/topic/public/default")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[2].name", equalTo(topics.get(2).getName())));
    }

    @Test
    void returnTopicByName() throws Exception {
        String name = "grogu";
        String fullTopic = "persistent://public/default/grogu";
        TopicDto topic = TopicDto.createTopicDto(name, topicStats, RandomString.make(1));

        when(topicService.getTopicWithMessagesByName(fullTopic)).thenReturn(topic);

        mockMvc.perform(get("/topic").queryParam("name", fullTopic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(fullTopic)));
    }

    @Test
    void getSubscriptionByNameAndTopic() throws Exception {
        String subscription = "R2D2";
        String topic = "Droide";

        SubscriptionDto subscriptionDto = SubscriptionDto.createSubscriptionDto(subscriptionStats, subscription);


        when(topicService.getSubscriptionByTopic(topic, subscription)).thenReturn(subscriptionDto);

        mockMvc.perform(get("/topic/" + topic + "/subscription/" + subscription)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(subscriptionDto)));
    }

    @Test
    void getProducerByNameAndTopic() throws Exception {
        String producer = "C3PO";
        String topic = "Droide";
        ProducerDto dto = new ProducerDto(producer, null, 0);

        when(topicService.getProducerByTopic(topic, producer)).thenReturn(dto);

        mockMvc.perform(get("/topic/" + topic + "/producer/" + producer)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(producer)));
    }

}
