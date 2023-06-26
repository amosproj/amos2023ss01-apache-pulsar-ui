/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.Schema;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

public class MessageServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Autowired
    private PulsarClient pulsarClient;

    @Test
    void getNumberOfLatestMessagesFromTopic_returnsMessages() throws Exception {
        String topicName = "persistent://public/default/messageToSend-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);

        MessageDto messageToSend = aMessage(topicName, "Hello World");
        Long timeBeforeSend = Instant.now().getEpochSecond();
        try (Producer<byte[]> producer = pulsarClient.newProducer()
                .topic(topicName).create()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
        }
        var messages = messageService.getLatestMessagesOfTopic(topicName, 1);

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
    void getNumberOfLatestMessagesFromTopic_forMessageWithSchema_returnsSchema() throws Exception {
        String topicName = "persistent://public/default/messageToSend-schema-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);

        Schema<TestSchema> schema = Schema.JSON(TestSchema.class);
        pulsarAdmin.schemas().createSchema(topicName, schema.getSchemaInfo());
        try (Producer<TestSchema> producer = pulsarClient.newProducer(schema)
                .topic(topicName)
                .create()) {

            producer.send(new TestSchema("Keks", 3));
        }
        var messages = messageService.getLatestMessagesOfTopic(topicName, 1);

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
