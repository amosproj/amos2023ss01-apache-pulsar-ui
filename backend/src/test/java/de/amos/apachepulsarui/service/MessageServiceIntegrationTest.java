/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.MessageId;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.Schema;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

public class MessageServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private TopicService topicService;

    //ToDo replace with a service to create subscriptions?
    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Autowired
    private PulsarClient pulsarClient;

    @Test
    void peekMessages_returnsSentMessages() throws PulsarAdminException {
        topicService.createNewTopic("messageToSend-service-integration-test");
        String topicName = "persistent://public/default/messageToSend-service-integration-test";
        pulsarAdmin.topics().createSubscription(topicName, "getGreatMessages", MessageId.latest);

        MessageDto messageToSend = aMessage(topicName, "Hello World");
        Long timeBeforeSend = Instant.now().getEpochSecond();
        messageService.sendMessage(messageToSend);
        var messages = messageService.peekMessages(topicName, "getGreatMessages");

        MessageDto messageReceived = messages.get(0);
        assertThat(messageReceived.getMessageId()).isNotEmpty(); // generated
        assertThat(messageReceived.getTopic()).isEqualTo(messageToSend.getTopic());
        assertThat(messageReceived.getPayload()).isEqualTo(messageToSend.getPayload());
        assertThat(messageReceived.getNamespace()).isEqualTo("default");
        assertThat(messageReceived.getTenant()).isEqualTo("public");
        assertThat(messageReceived.getPublishTime()).isGreaterThan(timeBeforeSend);
        assertThat(messageReceived.getSchema()).isEqualTo("");
    }


    @Test
    void peekMessages_forMessageWithSchema_returnsSchema() throws Exception {
        topicService.createNewTopic("messageToSend-schema-service-integration-test");
        String topicName = "persistent://public/default/messageToSend-schema-service-integration-test";
        pulsarAdmin.topics().createSubscription(topicName, "getSchemaMessages", MessageId.latest);

        Schema<TestSchema> schema = Schema.JSON(TestSchema.class);
        pulsarAdmin.schemas().createSchema(topicName, schema.getSchemaInfo());
        try (Producer<TestSchema> producer = pulsarClient.newProducer(schema)
                .topic(topicName)
                .create()) {

            producer.send(new TestSchema("Keks", 3));
        }
        var messages = messageService.peekMessages(topicName, "getSchemaMessages");

        MessageDto messageReceived = messages.get(0);
        assertThat(messageReceived.getSchema()).isEqualTo(schema.getSchemaInfo().getSchemaDefinition());
    }

    @NotNull
    private static MessageDto aMessage(String topic, String payload) {
        return MessageDto.create(topic, payload);
    }

    @Data
    @AllArgsConstructor
    public static class TestSchema {
        private String name;
        private int age;
    }
}
