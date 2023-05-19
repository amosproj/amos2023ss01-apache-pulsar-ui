/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDto;
import org.apache.pulsar.client.api.Consumer;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.common.naming.NamespaceName;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.CompletableFuture;

public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @Autowired
    private PulsarClient pulsarClient;

    @Test
    void getByNamespace_returnsCreatedTopics() {
        topicService.createNewTopic("topic-service-integration-test");
        List<TopicDto> topics = topicService.getAllByNamespace("public/default");
        Assertions.assertThat(topics.iterator().next().getName())
                .isEqualTo("persistent://public/default/topic-service-integration-test");
    }

    @Test
    void getAllByNamespace_returnsMessageCount() throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().topic(topicName).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe()) {
            // receive needs to happen before send, but we don't want to block -> async
            // after the message was sent, we need to ensure it was received -> .get()
            CompletableFuture<Message<byte[]>> consume1 = consumer.receiveAsync();
            producer.send(message);
            consume1.get();

            CompletableFuture<Message<byte[]>> consume2 = consumer.receiveAsync();
            producer.send(message);
            consume2.get();

            producer.send(message);
        }
        TopicDto topic = topicService.getAllByNamespace(NamespaceName.get("public", "default").toString()).stream()
                .filter(topicDto -> topicDto.getName().equals(topicName))
                .findFirst()
                .orElseThrow();
        Assertions.assertThat(topic.getProducedMessages()).isEqualTo(3);
        Assertions.assertThat(topic.getConsumedMessages()).isEqualTo(2);
    }

}
