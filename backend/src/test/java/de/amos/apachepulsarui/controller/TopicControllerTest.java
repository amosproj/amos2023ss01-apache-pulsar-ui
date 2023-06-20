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
import org.apache.pulsar.common.policies.data.ConsumerStats;
import org.apache.pulsar.common.policies.data.PublisherStats;
import org.apache.pulsar.common.policies.data.SubscriptionStats;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Set;

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

    @MockBean
    private PublisherStats publisherStats;

    @MockBean
    private ConsumerStats consumerStats;

    @Test
    void getAll_withoutParameters_returnsAllTopics() throws Exception {

        List<String> tenants = List.of("tenant1", "tenant2");
        List<String> namespaces = List.of("tenant1/namespace1", "tenant2/namespace1");

        List<TopicDto> topics = List.of(
                TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats),
                TopicDto.create("persistent://tenant2/namespace1/topic1", topicStats));

        when(tenantService.getAllNames()).thenReturn(tenants);
        when(namespaceService.getNamespaceNamesForTenants(tenants)).thenReturn(namespaces);
        when(topicService.getAllForNamespaces(namespaces)).thenReturn(topics);

        mockMvc.perform(get("/topic/all")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[1].namespace", equalTo(topics.get(1).getNamespace())))
                .andExpect(jsonPath("$.topics[1].tenant", equalTo(topics.get(1).getTenant())));
    }

    @Test
    void getAll_withProducer_returnsSpecifiyTopic() throws Exception {

        List<String> tenants = List.of("tenant1", "tenant2");
        List<String> namespaces = List.of("tenant1/namespace1", "tenant2/namespace1");

        TopicDto topicDto = TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats);
        topicDto.setProducers(List.of("Producer"));
        List<TopicDto> topics = List.of(topicDto);

        when(tenantService.getAllNames()).thenReturn(tenants);
        when(namespaceService.getNamespaceNamesForTenants(tenants)).thenReturn(namespaces);
        when(topicService.getAllForNamespaces(namespaces)).thenReturn(topics);
        when(topicService.getTopicForProducer(topics, "Producer")).thenReturn(topics);


        mockMvc.perform(get("/topic/all?producer=Producer")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())));
    }

    @Test
    void getAll_withSubscription_returnsSpecifiyTopic() throws Exception {

        List<String> tenants = List.of("tenant1", "tenant2");
        List<String> namespaces = List.of("tenant1/namespace1", "tenant2/namespace1");

        TopicDto topicDto = TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats);
        topicDto.setSubscriptions(Set.of("Subscription"));
        List<TopicDto> topics = List.of(topicDto);

        when(tenantService.getAllNames()).thenReturn(tenants);
        when(namespaceService.getNamespaceNamesForTenants(tenants)).thenReturn(namespaces);
        when(topicService.getAllForNamespaces(namespaces)).thenReturn(topics);
        when(topicService.getAllForSubscriptions(topics, List.of("Subscription"))).thenReturn(topics);


        mockMvc.perform(get("/topic/all?subscriptions=Subscription")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())));
    }
    @Test
    void getAll_withTenants_returnsAllTopicsForTenants() throws Exception {

        List<String> tenants = List.of("tenant1", "tenant2");
        List<String> namespaces = List.of("tenant1/namespace1", "tenant2/namespace1");

        List<TopicDto> topics = List.of(
                TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats),
                TopicDto.create("persistent://tenant2/namespace1/topic1", topicStats));

        when(namespaceService.getNamespaceNamesForTenants(tenants)).thenReturn(namespaces);
        when(topicService.getAllForNamespaces(namespaces)).thenReturn(topics);

        mockMvc.perform(get("/topic/all?tenants=tenant1,tenant2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[1].namespace", equalTo(topics.get(1).getNamespace())))
                .andExpect(jsonPath("$.topics[1].tenant", equalTo(topics.get(1).getTenant())));
    }

    @Test
    void getAll_withNamespaces_returnsAllTopicsForNamespaces() throws Exception {

        List<String> namespaces = List.of("tenant1/namespace1", "tenant2/namespace1");

        List<TopicDto> topics = List.of(
                TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats),
                TopicDto.create("persistent://tenant2/namespace1/topic1", topicStats));

        when(topicService.getAllForNamespaces(namespaces)).thenReturn(topics);

        mockMvc.perform(get("/topic/all?namespaces=tenant1/namespace1,tenant2/namespace1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[1].namespace", equalTo(topics.get(1).getNamespace())))
                .andExpect(jsonPath("$.topics[1].tenant", equalTo(topics.get(1).getTenant())));
    }

    @Test
    void getAll_withTopics_returnsTopics() throws Exception {

        List<String> topicNames = List.of("persistent://tenant1/namespace1/topic1",
                "persistent://tenant2/namespace1/topic1");

        List<TopicDto> topics = List.of(
                TopicDto.create("persistent://tenant1/namespace1/topic1", topicStats),
                TopicDto.create("persistent://tenant2/namespace1/topic1", topicStats));

        when(topicService.getAllForTopics(topicNames)).thenReturn(topics);

        mockMvc.perform(get("/topic/all?topics=persistent://tenant1/namespace1/topic1,persistent://tenant2/namespace1/topic1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topics[0].name", equalTo(topics.get(0).getName())))
                .andExpect(jsonPath("$.topics[0].namespace", equalTo(topics.get(0).getNamespace())))
                .andExpect(jsonPath("$.topics[0].tenant", equalTo(topics.get(0).getTenant())))
                .andExpect(jsonPath("$.topics[1].name", equalTo(topics.get(1).getName())))
                .andExpect(jsonPath("$.topics[1].namespace", equalTo(topics.get(1).getNamespace())))
                .andExpect(jsonPath("$.topics[1].tenant", equalTo(topics.get(1).getTenant())));
    }

    @Test
    void getTopicDetails() throws Exception {
        String name = "grogu";
        String fullTopic = "persistent://public/default/grogu";
        TopicDetailDto topic = TopicDetailDto.create(
                name,
                topicStats,
                RandomString.make(1),
                List.of()
        );

        when(topicService.getTopicDetails(fullTopic)).thenReturn(topic);

        mockMvc.perform(get("/topic").queryParam("name", fullTopic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(fullTopic)));
    }

    @Test
    void getSubscriptionByNameAndTopic() throws Exception {
        String subscription = "R2D2";
        String topic = "persistent://public/default/droide";

        SubscriptionDto subscriptionDto = SubscriptionDto.create(subscriptionStats, subscription);


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
        when(publisherStats.getProducerName()).thenReturn(producer);

        ProducerDto dto = ProducerDto.create(publisherStats);

        when(topicService.getProducerByTopic(topic, producer)).thenReturn(dto);

        mockMvc.perform(get("/topic/producer/" + producer)
                        .queryParam("topic", topic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(producer)));
    }

    @Test
    void getConsumerByNameAndTopic() throws Exception {
        String consumer = "BB8";
        String topic = "persistent://public/default/droide";

        when(consumerStats.getConsumerName()).thenReturn(consumer);

        ConsumerDto consumerDto = ConsumerDto.create(consumerStats);

        when(topicService.getConsumerByTopic(topic, consumer)).thenReturn(consumerDto);

        mockMvc.perform(get("/topic/consumer/" + consumer)
                        .queryParam("topic", topic)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", equalTo(consumer)));
    }

}
