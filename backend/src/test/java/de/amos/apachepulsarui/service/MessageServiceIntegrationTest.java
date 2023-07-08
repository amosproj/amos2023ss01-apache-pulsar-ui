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
import org.apache.pulsar.client.api.Consumer;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.Schema;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;

import static java.util.Collections.emptyList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class MessageServiceIntegrationTest extends AbstractIntegrationTest {

    private static final String TOPICNAME = "persistent://public/default/messageToSend-service-integration-test";

    @Autowired
    private MessageService messageService;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Autowired
    private PulsarClient pulsarClient;


    @BeforeEach
    void createTopic() throws PulsarAdminException {
        pulsarAdmin.topics().createNonPartitionedTopic("messageToSend-service-integration-test");
    }

    @AfterEach
    void deleteTopics() throws PulsarAdminException {
        pulsarAdmin.topics().delete(TOPICNAME);
    }

    @Test
    void getNumberOfLatestMessagesFromTopic_returnsMessages() throws Exception {

        MessageDto messageToSend = aMessage();
        Long timeBeforeSend = Instant.now().getEpochSecond();
        try (Producer<byte[]> producer = pulsarClient.newProducer()
                .topic(TOPICNAME).create()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, emptyList(), emptyList());

        MessageDto messageReceived = messages.iterator().next();
        assertThat(messageReceived.getMessageId()).isNotEmpty(); // generated
        assertThat(messageReceived.getTopic()).isEqualTo(messageToSend.getTopic());
        assertThat(messageReceived.getPayload()).isEqualTo(messageToSend.getPayload());
        assertThat(messageReceived.getNamespace()).isEqualTo("default");
        assertThat(messageReceived.getTenant()).isEqualTo("public");
        assertThat(messageReceived.getPublishTime()).isGreaterThan(timeBeforeSend);
        assertThat(messageReceived.getSchema()).isEqualTo("");
    }


    @Test
    void getNumberOfLatestMessagesFromTopicFilteredByProducer_returnsMessages() throws Exception {
        String producerName = "Producername";


        MessageDto messageToSend = aMessage();
        Long timeBeforeSend = Instant.now().getEpochSecond();
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName(producerName)
                .topic(TOPICNAME).create()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, List.of(producerName), emptyList());

        MessageDto messageReceived = messages.iterator().next();
        assertThat(messageReceived.getMessageId()).isNotEmpty(); // generated
        assertThat(messageReceived.getTopic()).isEqualTo(messageToSend.getTopic());
        assertThat(messageReceived.getPayload()).isEqualTo(messageToSend.getPayload());
        assertThat(messageReceived.getNamespace()).isEqualTo("default");
        assertThat(messageReceived.getTenant()).isEqualTo("public");
        assertThat(messageReceived.getPublishTime()).isGreaterThan(timeBeforeSend);
        assertThat(messageReceived.getSchema()).isEqualTo("");
    }

    @Test
    void getNumberOfLatestMessagesFromTopicFilteredByProducer_returnsEmpty() throws Exception {
        String producerName = "Producername";
        String notTheProducerName = "Donald Duck";

        MessageDto messageToSend = aMessage();
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName(producerName)
                .topic(TOPICNAME).create()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
            producer.close();
        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, List.of(notTheProducerName), emptyList());

        assertEquals(0, messages.size());
    }

    @Test
    void getNumberOfLatestMessagesFromTopicFilteredBySubscription_returnsEmpty() throws Exception {
        String producerName = "Producername";
        String subscriptionName = "SubscriptionName";
        String notTheSubscriptionName = "Daniel Duesentrieb";

        MessageDto messageToSend = aMessage();
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName(producerName).topic(TOPICNAME).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(TOPICNAME).subscriptionName(subscriptionName).subscribe()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
            consumer.receive();
            producer.close();
            consumer.close();
        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, emptyList(), List.of(notTheSubscriptionName));

        assertEquals(0, messages.size());
    }

    @Test
    void getNumberOfLatestMessagesFromTopicFilteredBySubscription_returnsMessages() throws Exception {
        String producerName = "Producername";
        String subscriptionName = "SubscriptionName";

        MessageDto messageToSend = aMessage();
        Long timeBeforeSend = Instant.now().getEpochSecond();
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName(producerName).topic(TOPICNAME).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(TOPICNAME).subscriptionName(subscriptionName).subscribe()) {

            producer.send(messageToSend.getPayload().getBytes(StandardCharsets.UTF_8));
            consumer.receive();
            producer.close();
            consumer.close();
        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, emptyList(), List.of(subscriptionName));

        MessageDto messageReceived = messages.iterator().next();
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
        Schema<TestSchema> schema = Schema.JSON(TestSchema.class);
        pulsarAdmin.schemas().createSchema(TOPICNAME, schema.getSchemaInfo());
        try (Producer<TestSchema> producer = pulsarClient.newProducer(schema)
                .topic(TOPICNAME)
                .create()) {

            producer.send(new TestSchema("Keks", 3));
            producer.close();

        }
        var messages = messageService.getLatestMessagesFiltered(TOPICNAME, 1, emptyList(), emptyList());

        MessageDto messageReceived = messages.iterator().next();
        assertThat(messageReceived.getSchema()).isEqualTo(schema.getSchemaInfo().getSchemaDefinition());
    }

    @NotNull
    private static MessageDto aMessage() {
        return MessageDto.create(TOPICNAME, "Hello World");
    }

    @Data
    @AllArgsConstructor
    public static class TestSchema {
        private String name;
        private int age;
    }
}
