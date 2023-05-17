/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.startup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.*;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationStartupListener {

    private final PulsarAdmin pulsarAdmin;

    private final PulsarClient pulsarClient;

    @EventListener
    public void onApplicationReadyEvent(ApplicationReadyEvent event) {
        try {
            deleteOldTopics();
            createTopicsWithMessages();
        } catch (PulsarAdminException | PulsarClientException e) {
            throw new RuntimeException(e);
        }
    }

    private void deleteOldTopics() throws PulsarAdminException {
        Stream<String> topics = pulsarAdmin.topics().getList("public/default").stream();
        topics.forEach(topic -> {
            try {
                pulsarAdmin.topics().delete(topic);
            } catch (PulsarAdminException e) {
                throw new RuntimeException(e);
            }
        });
    }

    private void createTopicsWithMessages() throws PulsarAdminException, PulsarClientException {
        int index = 0;

        while (index < 5) {
            String topicName = "topic-" + RandomStringUtils.random(20);
            pulsarAdmin.topics().createNonPartitionedTopic(topicName);
            log.info(topicName + "is created");
            createMessages(topicName);
            createConsumer(topicName);
            index++;
        }
    }

    private void createConsumer(String topicName) throws PulsarClientException {
        String consumerName = topicName + "Consumer" + RandomStringUtils.random(3);
        pulsarClient.newConsumer()
                .topic(topicName)
                .consumerName(consumerName)
                .subscriptionType(SubscriptionType.Shared)
                .subscriptionName(consumerName)
                .subscribe();
        log.info(consumerName + "is created");
    }

    private void createMessages(String topicName) throws PulsarClientException {
        Producer<byte[]> producer = createProducer(topicName);
        int index = 0;

        while (index < 10) {
            producer.newMessage()
                    .key("key " + index)
                    .value(RandomStringUtils.random(10).getBytes())
                    .send();
            log.info("New MessageDto with Key " + index + "on TopicDto " + topicName);
            index++;
        }
    }

    private Producer<byte[]> createProducer(String topicName) throws PulsarClientException {
        return pulsarClient.newProducer().topic(topicName).compressionType(CompressionType.LZ4).create();
    }
}
