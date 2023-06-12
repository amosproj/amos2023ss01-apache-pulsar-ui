/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDetailDto;
import org.apache.pulsar.client.admin.Lookup;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock
    private Topics topics;
    @Mock
    private PulsarAdmin pulsarAdmin;
    @Mock
    private TopicStats topicStats;
    @Mock
    private MessageService messageService;
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

        assertEquals(topicService.getAllByNamespace(NAMESPACE), List.of(TOPIC_NAME));
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

    @Test
    void createNewTopic() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);

        topicService.createNewTopic(TOPIC_NAME);

        verify(pulsarAdmin.topics()).createNonPartitionedTopic(TOPIC_NAME);
    }

    @Test
    void getTopicWithMessagesByName() throws PulsarAdminException {
        whenTopicStats();
        whenOwnerBroker();

        topicService.getTopicDetails(TOPIC_NAME);

        topicDtoMockedStatic.verify(
                () -> TopicDetailDto.createTopicDtoWithMessages(TOPIC_NAME, topicStats, BROKER, List.of()),
                times(1)
        );
    }
}
