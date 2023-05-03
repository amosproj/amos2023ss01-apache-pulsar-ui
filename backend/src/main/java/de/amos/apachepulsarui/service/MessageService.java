/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Message;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.apache.pulsar.client.api.Reader;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@Scope("singleton")
@RequiredArgsConstructor
public class MessageService {

    public static final int MAX_NUM_MESSAGES = 20;
    private final PulsarClient pulsarClient;

    private final PulsarAdmin pulsarAdmin;

    public List<Message> getMessagesByTopicName (String name) {
        Reader<byte[]> messageReader = createReader(name);
        List<Message> messages = new ArrayList<>();
        try {
            while (messageReader.hasReachedEndOfTopic()) {
                var message = messageReader.readNext();
                messages.add(new Message(message.getSequenceId(), message.getData().toString()));
            }
            return messages;

        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }
    }


    public List<Message> peekMessages(String topic, String subscription) {
        try {
            var messages = pulsarAdmin.topics().peekMessages(topic, subscription, MAX_NUM_MESSAGES);
            return messages.stream()
                    .map(message -> new Message(message.getSequenceId(), new String(message.getData(), StandardCharsets.UTF_8)))
                    .toList();
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    private Reader<byte[]> createReader(String topicName) {
        try {
            return pulsarClient.newReader()
                    .topic(topicName)
                    .create();
        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }
    }

}
