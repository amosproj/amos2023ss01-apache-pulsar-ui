/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDetailDto;
import de.amos.apachepulsarui.dto.TopicDto;
import org.apache.pulsar.client.admin.Lookup;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.admin.Schemas;
import org.apache.pulsar.client.admin.Topics;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock
    private Topics topics;
    @Mock
    private Schemas schemas;
    @Mock
    private PulsarAdmin pulsarAdmin;
    @Mock
    private TopicStats topicStats;
    @Mock
    private Lookup lookup;

    @InjectMocks
    private TopicService topicService;
    MockedStatic<TopicDetailDto> topicDtoMockedStatic;
    MockedStatic<TopicName> topicNameMockedStatic;
    private static final String BROKER = "Broker";
    private static final String NAMESPACE = "public/default";
    private static final String TOPIC_NAME = "persistent://public/default/tatooine";

    @BeforeEach
    public void beforeEach() {
        topicDtoMockedStatic = Mockito.mockStatic(TopicDetailDto.class);
        topicNameMockedStatic = Mockito.mockStatic(TopicName.class);
    }

    @AfterEach
    public void afterEach() {
        topicDtoMockedStatic.close();
        topicNameMockedStatic.close();
    }


    @Test
    void getAllTopicsByNamespace() throws PulsarAdminException {
        whenAdminTopics();

        assertEquals(topicService.getAllForNamespace(NAMESPACE), List.of(TOPIC_NAME));
    }

    private void whenTopicStats() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getStats(TOPIC_NAME)).thenReturn(topicStats);
    }

    private void whenAdminTopics() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getList(NAMESPACE)).thenReturn(List.of(TOPIC_NAME));
    }

    private void whenOwnerBroker() throws PulsarAdminException {
        when(pulsarAdmin.lookups()).thenReturn(lookup);
        when(pulsarAdmin.lookups().lookupTopic(TOPIC_NAME)).thenReturn(BROKER);
    }

    private void whenSchemas() throws PulsarAdminException {
        when(pulsarAdmin.schemas()).thenReturn(schemas);
        when(pulsarAdmin.schemas().getAllSchemas(TOPIC_NAME)).thenReturn(List.of());
    }

    @Test
    void getTopicDetails() throws PulsarAdminException {
        whenTopicStats();
        whenOwnerBroker();
        whenSchemas();

        topicService.getTopicDetails(TOPIC_NAME);

        topicDtoMockedStatic.verify(
                () -> TopicDetailDto.create(TOPIC_NAME, topicStats, BROKER, List.of()),
                times(1)
        );
    }


    @Test
    void getTopicByProducer() {
        TopicDto topicDto = TopicDto.builder().build();
        topicDto.setProducers(List.of("wantedProducer"));
        TopicDto topicDto1 = TopicDto.builder().build();
        topicDto1.setProducers(List.of("unWantedProducer"));
        List<TopicDto> topics = List.of(topicDto, topicDto1);

        assertEquals(topicService.getTopicsForProducer(topics, "wantedProducer").size() , 1);
    }

    @Test
    void getTopicBySubscription() {
        TopicDto topicDto = TopicDto.builder().build();
        topicDto.setSubscriptions(Set.of("wantedSubscription"));
        TopicDto topicDto1 = TopicDto.builder().build();
        topicDto1.setSubscriptions(Set.of("unWantedSubscription"));
        List<TopicDto> topics = List.of(topicDto, topicDto1);

        assertEquals(topicService.getTopicsForSubscriptions(topics, List.of("wantedSubscription")).size() , 1);
    }

}
