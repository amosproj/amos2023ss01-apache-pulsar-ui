/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.*;
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
    void returnAllTopicNames() throws Exception {

        List<String> topics = List.of(
                "persistent://public/default/tatooine",
                "non-persistent://public/default/naboo",
                "persistent://public/default/coruscant"
        );

        TenantDto tenantDto = TenantDto.fromString("pulic");
        NamespaceDto namespaceDto = NamespaceDto.fromString("public/default");
        when(tenantService.getAllTenants()).thenReturn(List.of(tenantDto));
        when(namespaceService.getAllOfTenant(tenantDto)).thenReturn(List.of(namespaceDto));
        when(topicService.getAllNamesByNamespace(namespaceDto.getId())).thenReturn(topics);



        mockMvc.perform(get("/topic/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0]", equalTo(topics.get(0))))
                .andExpect(jsonPath("$.topics[1]", equalTo(topics.get(1))))
                .andExpect(jsonPath("$.topics[2]", equalTo(topics.get(2))));
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
        String topic = "persistent://public/default/droide";
        List<MessageDto> messages = List.of();

        SubscriptionDto subscriptionDto = SubscriptionDto.create(subscriptionStats, messages ,subscription);


        when(topicService.getSubscriptionByTopic(topic, subscription)).thenReturn(subscriptionDto);

        mockMvc.perform(get("/topic/subscription/" + subscription)
                        .queryParam("topic", topic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(subscription)));
    }

    @Test
    void getProducerByNameAndTopic() throws Exception {
        String producer = "C3PO";
        String topic = "persistent://public/default/droide";
        ProducerDto dto = new ProducerDto(producer, null, 0);

        when(topicService.getProducerByTopic(topic, producer)).thenReturn(dto);

        mockMvc.perform(get("/topic/producer/" + producer)
                        .queryParam("topic", topic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(producer)));
    }

}
