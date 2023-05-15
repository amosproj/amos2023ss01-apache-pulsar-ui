/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.api.PulsarClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
public class MessageServiceTest {

    @Mock
    private PulsarAdmin pulsarAdmin;

    @Mock
    private PulsarClient pulsarClient;

    @Test
    void isValidMessage_forMessageWithValidTopic_returnsTrue() {
        MessageService messageService = new MessageService(pulsarClient, pulsarAdmin);
        String validTopicName = "persistent://public/default/test-topic";
        MessageDto message = MessageDto.create(validTopicName, "hello");

        assertThat(messageService.inValidTopicName(message)).isFalse();
    }

    @Test
    void isValidMessage_forMessageWithInvalidTopic_returnsFalse() {
        MessageService messageService = new MessageService(pulsarClient, pulsarAdmin);
        String invalidTopicName = "bla//blub";
        MessageDto message = MessageDto.create(invalidTopicName, "hello");

        assertThat(messageService.inValidTopicName(message)).isTrue();
    }

    @Test
    void isValidMessage_forMessageWithEmptyTopic_returnsFalse() {
        MessageService messageService = new MessageService(pulsarClient, pulsarAdmin);
        String emptyTopicName = "";
        MessageDto message = MessageDto.create(emptyTopicName, "hello");

        assertThat(messageService.inValidTopicName(message)).isTrue();
    }
}
