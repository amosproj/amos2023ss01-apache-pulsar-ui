/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TopicDto;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TopicServiceTest {

    @Mock
    private NamespaceService namespaceService;
    @Mock
    private Topics topics;
    @Mock
    private PulsarAdmin pulsarAdmin;
    @Mock
    private TopicStats topicStats;
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
        when(namespaceService.getAll()).thenReturn(List.of(NamespaceDto.fromString("abc")));
        whenAdminTopics();
        whenTopicStats();

        topicService.getAllTopics();

        topicDtoMockedStatic.verify(
                () -> TopicDto.createTopicDto("Topic", topicStats),
                times(1)
        );
    }

    void whenTopicStats() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getStats("Topic")).thenReturn(topicStats);
    }


    void whenAdminTopics() throws PulsarAdminException {
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getList("abc")).thenReturn(List.of("Topic"));
    }

    @Test
    void getByNamespace() throws PulsarAdminException {
        NamespaceDto namespaceDto = NamespaceDto.fromString("abc");
        whenAdminTopics();
        whenTopicStats();

        topicService.getByNamespace(namespaceDto, 1);

        topicDtoMockedStatic.verify(
                () -> TopicDto.createTopicDto("Topic", topicStats),
                times(1)
        );
    }

    @Test
    void createNewTopic() throws PulsarAdminException {
        String topic = "Topic";
        when(pulsarAdmin.topics()).thenReturn(topics);

        assertTrue(topicService.createNewTopic(topic));

        verify(pulsarAdmin.topics()).createNonPartitionedTopic(topic);
    }

    @Test
    void isValidTopic() {
        String topic = "Topic";

        topicService.isValidTopic(topic);

        topicNameMockedStatic.verify(
                () -> TopicName.isValid(topic),
                times(1)
        );    }
}
