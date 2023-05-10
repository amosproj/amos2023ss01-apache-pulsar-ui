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
import org.apache.pulsar.common.policies.data.TopicStats;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

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

    @Test
    void getAllTopics() throws PulsarAdminException {
        MockedStatic <TopicDto> topicDtoMockedStatic = Mockito.mockStatic(TopicDto.class);
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
    void getByNamespace() {
    }

    @Test
    void createNewTopic() {
    }

    @Test
    void isValidTopic() {
    }
}
