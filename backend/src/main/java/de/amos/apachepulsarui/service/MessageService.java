/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import java.nio.charset.StandardCharsets;
import java.util.List;

import de.amos.apachepulsarui.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    public static final int MAX_NUM_MESSAGES = 20;

    private final PulsarClient pulsarClient;
    private final PulsarAdmin pulsarAdmin;


    // TODO get all messages for all topics, instead of just the first one
    public List<MessageDto> peekMessages(String topic) {
        try {
            List<String> subscriptions = pulsarAdmin.topics().getSubscriptions(topic);
            return peekMessages(topic, subscriptions.get(0));
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    public List<MessageDto> peekMessages(String topic, String subscription) {
        try {
            var messages = pulsarAdmin.topics().peekMessages(topic, subscription, MAX_NUM_MESSAGES);
            return messages.stream()
                    .map(MessageDto::fromExistingMessage)
                    .toList();
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean sendMessage(MessageDto messageDto) {
        try {
            Producer<byte[]> producer = this.createProducerFor(messageDto.getTopic());
            producer.send(messageDto.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
            return true;
        } catch (PulsarClientException e) {
            log.error("Could not send messageDto to topic %s.".formatted(messageDto.getTopic()));
            return false;
        }
    }

    public boolean sendMessages(List<MessageDto> messageDtos) {
        try {
            Producer<byte[]> producer = this.createProducerFor(messageDtos.iterator().next().getTopic());
            for (MessageDto messageDto : messageDtos) {
                producer.send(messageDto.getPayload().getBytes(StandardCharsets.UTF_8));
            }
            producer.close();
            return true;
        } catch (PulsarClientException e) {
            log.error("Could not list of %s messageDtos to topic %s."
                    .formatted(messageDtos.size(), messageDtos.iterator().next().getTopic())
            );
            return false;
        }
    }

    public boolean isValidMessage(MessageDto messageDto) {
        return TopicName.isValid(messageDto.getTopic());
    }

    private Producer<byte []> createProducerFor(String topicName) throws PulsarClientException {
        return pulsarClient.newProducer()
                .topic(topicName)
                .create();
    }

}
