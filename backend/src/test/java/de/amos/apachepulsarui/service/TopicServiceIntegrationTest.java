/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.api.*;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @Autowired
    private PulsarClient pulsarClient;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Test
    void getByNamespace_returnsCreatedTopics() {
        String topicName = "persistent://public/default/test123";
        topicService.createNewTopic(topicName);
        List<String> topics = topicService.getAllByNamespace("public/default");
        Assertions.assertThat(topics).containsExactly(topicName);
    }

    @Test
    void getTopicDetails_returnsMessageCount() throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        topicService.createNewTopic(topicName);
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().topic(topicName).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe()) {
            // receive needs to happen before send, but we don't want to block -> async
            // after the message was sent, we need to ensure it was received -> .get()
            CompletableFuture<Message<byte[]>> consume1 = consumer.receiveAsync();
            producer.sendAsync(message);
            consume1.get();

            CompletableFuture<Message<byte[]>> consume2 = consumer.receiveAsync();
            producer.sendAsync(message);
            consume2.get();

            producer.send(message);
            consumer.close();
            producer.close();
        }
        TopicDto topic = topicService.getTopicDetails(topicName);
        // it seems there is no exactly once guarantees in pulsar which made the test flaky -> use greaterThan instead of equals
        Assertions.assertThat(topic.getProducedMessages()).isGreaterThanOrEqualTo(3);
        Assertions.assertThat(topic.getConsumedMessages()).isGreaterThanOrEqualTo(2);
    }

    @Test
    void getSubscriptionsByTopic () throws PulsarClientException {
        String topicName = "persistent://public/default/topic-service-integration-test";
        topicService.createNewTopic(topicName);
        Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe();

        consumer.close();
        Assertions.assertThat(topicService.getSubscriptionByTopic(topicName, "TestSubscriber")
                .getName()).isEqualTo("TestSubscriber");
    }

    @Test
    void getProducerByTopic () throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        topicService.createNewTopic(topicName);
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName("Producer").topic(topicName).create()) {

            producer.send(message);
            Assertions.assertThat(topicService.getProducerByTopic(topicName,"Producer").getName()).isEqualTo("Producer");
            producer.close();
        }

    }

}
