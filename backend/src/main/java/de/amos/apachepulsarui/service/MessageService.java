/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.api.Message;
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

    public List<MessageDto> getMessagesByTopicName (String name) {
        Reader<byte[]> messageReader = createReader(name);
        List<MessageDto> messages = new ArrayList<>();
        try {
            while (messageReader.hasReachedEndOfTopic()) {
                Message<byte []> message = messageReader.readNext();
                messages.add(MessageDto.builder().data(message.getData().toString()).id(message.getSequenceId()).build());
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
