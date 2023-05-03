/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final PulsarClient pulsarClient;

    private final PulsarAdmin pulsarAdmin;

    private final NamespaceService namespaceService;

    private final MessageService messageService;



    public void sendMessageToTopic(String topicName) {
        Producer<byte[]> producer = createProducer(topicName);

        try {
            producer.newMessage()
                    .key("my-message-key")
                    .value("my-async-message".getBytes())
                    .property("my-key", "my-value")
                    .property("my-other-key", "my-other-value")
                    .send();
        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }
    }

    private Producer<byte[]> createProducer(String topicName) {
        try {
            return pulsarClient.newProducer().topic(topicName).compressionType(CompressionType.LZ4).create();
        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }

    }


    public List<String> getAllTopics() {
        List<String> namespaces = namespaceService.getAllPublicNamespaces();
        return namespaces.stream()
                .flatMap(namespace -> {
                    try {
                        return pulsarAdmin.topics().getList(namespace).stream();
                    } catch (PulsarAdminException e) {
                        throw new RuntimeException(e);
                    }
                })
                .toList();

    }

    public List<MessageDto> getMessagesByTopicName(String topicName) {
        return messageService.getMessagesByTopicName(topicName);
    }
}
