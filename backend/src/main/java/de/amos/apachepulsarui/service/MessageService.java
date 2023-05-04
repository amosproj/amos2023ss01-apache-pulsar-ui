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
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

@Service
@Scope("singleton")
@Slf4j
@RequiredArgsConstructor
public class MessageService {

    public static final int MAX_NUM_MESSAGES = 20;

    private final PulsarClient pulsarClient;
    private final PulsarAdmin pulsarAdmin;

    // TODO: admin.topics().getSubscriptions(topic);
    //  -> It's possible to peekMessages messages without knowing the subscription. We just need to query for
    //  all subscriptions of this topic. Probably the subscription should be an optional parameter.
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
        try (Producer<byte[]> producer = pulsarClient.newProducer()
                .topic(message.getTopic())
                .create()
        ) {
            producer.send(Base64.getDecoder().decode(message.getPayload()));
            return true;
        } catch (PulsarClientException e) {
            log.error("Could not create producer for topic %s.".formatted(message.getTopic()));
            return false;
        }
    }

    public boolean isValidMessage(Message message) {
        return TopicName.isValid(message.getTopic());
    }

}
