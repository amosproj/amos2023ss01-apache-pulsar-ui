/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDto;
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

import static org.junit.jupiter.api.Assertions.assertTrue;
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
    MockedStatic <TopicDto> topicDtoMockedStatic;

    MockedStatic <TopicName> topicNameMockedStatic;


    @BeforeEach
    public void beforeEach() {
        topicDtoMockedStatic = Mockito.mockStatic(TopicDto.class);
        topicNameMockedStatic = Mockito.mockStatic(TopicName.class);
    }

    @AfterEach
    public void afterEach() {
        topicDtoMockedStatic.close();
        topicNameMockedStatic.close();
    }

    @Test
    void getAllTopics() throws PulsarAdminException {
        whenAdminTopics();
        whenTopicStats();
        whenOwnerBroker();

        topicService.getAllByNamespace("abc");

        topicDtoMockedStatic.verify(
                () -> TopicDto.createTopicDto("Topic", topicStats, "zyx"),
                times(1)
        );
    }

    private void whenTopicStats() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getStats("Topic")).thenReturn(topicStats);
    }


    private void whenAdminTopics() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getList("abc")).thenReturn(List.of("Topic"));
    }

    private void whenOwnerBroker() throws PulsarAdminException {
        when(pulsarAdmin.lookups()).thenReturn(lookup);
        when(pulsarAdmin.lookups().lookupTopic("Topic")).thenReturn("zyx");

    }

    @Test
    void createNewTopic() throws PulsarAdminException {
        String topic = "Topic";
        when(pulsarAdmin.topics()).thenReturn(topics);

        assertTrue(topicService.createNewTopic(topic));

        verify(pulsarAdmin.topics()).createNonPartitionedTopic(topic);
    }

    @Test
    void getTopicWithMessagesByName() throws PulsarAdminException {
        when(messageService.peekMessages("Topic")).thenReturn(List.of());
        whenTopicStats();
        whenOwnerBroker();

        topicService.getTopicWithMessagesByName("Topic");


        topicDtoMockedStatic.verify(
                () -> TopicDto.createTopicDtoWithMessages("Topic", topicStats, "zyx", List.of()),
                times(1)
        );
    }
}
