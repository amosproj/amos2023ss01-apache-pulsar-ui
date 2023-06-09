/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
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

    public List<MessageDto> peekMessages(String topic, String subscription) throws PulsarApiException {
        var schema = getSchemaIfExists(topic);
        try {
            var messages = pulsarAdmin.topics().peekMessages(topic, subscription, MAX_NUM_MESSAGES);
            return messages.stream()
                    .map(message -> MessageDto.fromExistingMessage(message, schema))
                    .toList();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not peek messages for topic '%s' with subscription '%s'".formatted(topic, subscription),
                    e
            );
        }
    }

    private String getSchemaIfExists(String topic) {
        try {
            return pulsarAdmin.schemas().getSchemaInfo(topic).getSchemaDefinition();
        } catch (PulsarAdminException e) {
            return "";
        }
    }

    public void sendMessage(MessageDto messageDto) throws PulsarApiException {
        try {
            Producer<byte[]> producer = this.createProducerFor(messageDto.getTopic());
            producer.send(messageDto.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
        } catch (PulsarClientException e) {
            throw new PulsarApiException("Could not send messageDto to topic '%s'".formatted(messageDto.getTopic()), e);
        }
    }

    public void sendMessages(List<MessageDto> messageDtos) throws PulsarApiException {
        try {
            Producer<byte[]> producer = this.createProducerFor(messageDtos.iterator().next().getTopic());
            for (MessageDto messageDto : messageDtos) {
                producer.send(messageDto.getPayload().getBytes(StandardCharsets.UTF_8));
            }
            producer.close();
        } catch (PulsarClientException e) {
            throw new PulsarApiException(
                    "Could not list of %s messageDtos to topic '%s'".formatted(messageDtos.size(), messageDtos.iterator().next().getTopic()),
                    e
            );
        }
    }

    public boolean inValidTopicName(MessageDto messageDto) {
        return !TopicName.isValid(messageDto.getTopic());
    }

    private Producer<byte []> createProducerFor(String topicName) throws PulsarClientException {
        return pulsarClient.newProducer()
                .topic(topicName)
                .create();
    }

}
