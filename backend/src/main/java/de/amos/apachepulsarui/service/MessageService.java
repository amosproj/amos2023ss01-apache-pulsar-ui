/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    public static final int MAX_NUM_MESSAGES = 20;

    private final PulsarClient pulsarClient;
    private final PulsarAdmin pulsarAdmin;


    // TODO get all messages for all topics, instead of just the first one
    public List<Message> peekMessages(String topic) {
        try {
            List<String> subscriptions = pulsarAdmin.topics().getSubscriptions(topic);
            return peekMessages(topic, subscriptions.get(0));
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Message> peekMessages(String topic, String subscription) {
        try {
            var messages = pulsarAdmin.topics().peekMessages(topic, subscription, MAX_NUM_MESSAGES);
            return messages.stream()
                    .map(message -> Message.builder()
                            .key(message.getKey())
                            .payload(new String(message.getData(), StandardCharsets.UTF_8))
                            .topic(message.getTopicName())
                            .build())
                    .toList();
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean sendMessage(Message message) {
        try {
            Producer<byte[]> producer = this.createProducerFor(message.getTopic());
            producer.send(message.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
            return true;
        } catch (PulsarClientException e) {
            log.error("Could not send message to topic %s.".formatted(message.getTopic()));
            return false;
        }
    }

    public boolean sendMessages(List<Message> messages) {
        try {
            Producer<byte[]> producer = this.createProducerFor(messages.iterator().next().getTopic());
            for (Message message : messages) {
                producer.send(message.getPayload().getBytes(StandardCharsets.UTF_8));
            }
            producer.close();
            return true;
        } catch (PulsarClientException e) {
            log.error("Could not list of %s messages to topic %s."
                    .formatted(messages.size(), messages.iterator().next().getTopic())
            );
            return false;
        }
    }

    public boolean isValidMessage(Message message) {
        return TopicName.isValid(message.getTopic());
    }

    private Producer<byte []> createProducerFor(String topicName) throws PulsarClientException {
        return pulsarClient.newProducer()
                .topic(topicName)
                .create();
    }

}
