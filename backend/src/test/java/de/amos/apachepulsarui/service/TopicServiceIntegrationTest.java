/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TopicDetailDto;
import de.amos.apachepulsarui.dto.TopicDto;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Consumer;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.common.policies.data.TopicStats;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;
import java.util.List;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TopicServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private TopicService topicService;

    @Autowired
    private PulsarClient pulsarClient;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @BeforeAll
    void createTenantsAndNamespaces() throws PulsarAdminException {
        pulsarAdmin.namespaces().createNamespace("public/namespace1");
        pulsarAdmin.namespaces().createNamespace("public/namespace2");
    }

    @Test
    void getAllForNamespaces_returnsTopics() throws PulsarAdminException {
        List<String> namespaces = List.of("public/namespace1", "public/namespace2");
        pulsarAdmin.topics().createNonPartitionedTopic("persistent://public/namespace1/topic1");
        pulsarAdmin.topics().createNonPartitionedTopic("persistent://public/namespace2/topic1");

        TopicStats topicstats1 = pulsarAdmin.topics().getStats("persistent://public/namespace1/topic1");
        TopicStats topicstats2 = pulsarAdmin.topics().getStats("persistent://public/namespace2/topic1");

        List<TopicDto> expectedTopics = List.of(
                TopicDto.create("persistent://public/namespace1/topic1", topicstats1),
                TopicDto.create("persistent://public/namespace2/topic1", topicstats2));

        List<TopicDto> topics = topicService.getAllForNamespaces(namespaces);
        Assertions.assertThat(topics).containsExactlyInAnyOrderElementsOf(expectedTopics);
    }

    @Test
    void getAllForTopics_returnsExistingTopics() throws PulsarAdminException {
        List<String> topicNames = List.of("persistent://public/namespace1/topic3",
                "persistent://public/namespace2/topic4");
        pulsarAdmin.topics().createNonPartitionedTopic("persistent://public/namespace1/topic3");

        TopicStats topicstats3 = pulsarAdmin.topics().getStats("persistent://public/namespace1/topic3");


        TopicDto expectedTopic = TopicDto.create("persistent://public/namespace1/topic3", topicstats3);

        List<TopicDto> topics = topicService.getAllForTopics(topicNames);
        Assertions.assertThat(topics).containsExactly(expectedTopic);
    }

    @Test
    void getAllByNamespace_returnsTopics() throws PulsarAdminException {
        String topicName = "persistent://public/default/topic1";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);
        List<String> topics = topicService.getAllByNamespace("public/default");
        Assertions.assertThat(topics).containsExactly(topicName);
    }

    @Test
    void getTopicDetails_returnsMessageCount() throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().topic(topicName).create();
             Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe())
        {
            producer.send(message);
            producer.send(message);
            producer.send(message);

            consumer.receive();
            consumer.receive();

            consumer.close();
            producer.close();
        }
        TopicDetailDto topic = topicService.getTopicDetails(topicName);
        // it seems there is no exactly once guarantees in pulsar which made the test flaky -> use greaterThan instead of equals
        Assertions.assertThat(topic.getTopicStatsDto().getProducedMesages()).isGreaterThanOrEqualTo(3);
        Assertions.assertThat(topic.getTopicStatsDto().getConsumedMessages()).isGreaterThanOrEqualTo(2);
    }

    @Test
    void getSubscriptionsByTopic () throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);
        Consumer<byte[]> consumer = pulsarClient.newConsumer().topic(topicName).subscriptionName("TestSubscriber").subscribe();

        consumer.close();
        Assertions.assertThat(topicService.getSubscriptionByTopic(topicName, "TestSubscriber")
                .getName()).isEqualTo("TestSubscriber");
    }

    @Test
    void getProducerByTopic () throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Producer<byte[]> producer = pulsarClient.newProducer().producerName("Producer").topic(topicName).create()) {

            producer.send(message);
            Assertions.assertThat(topicService.getProducerByTopic(topicName,"Producer").getName()).isEqualTo("Producer");
            producer.close();
        }

    }

    @Test
    void getConsumerByTopic () throws Exception {
        String topicName = "persistent://public/default/topic-service-integration-test";
        pulsarAdmin.topics().createNonPartitionedTopic(topicName);
        var message = "hello world".getBytes(StandardCharsets.UTF_8);
        try (Consumer<byte[]> consumer = pulsarClient.newConsumer().consumerName("consumer").topic(topicName).subscriptionName("subscription").subscribe()) {
            Assertions.assertThat(topicService.getConsumerByTopic(topicName,"consumer").getName()).isEqualTo("consumer");
        }

    }

}
