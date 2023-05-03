/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Message;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.apache.pulsar.client.api.Reader;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final PulsarClient pulsarClient;

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
