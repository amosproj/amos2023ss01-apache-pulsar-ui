/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.api.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final PulsarClient pulsarClient;

    public byte[] getMessagesByTopicName (String name) {
        Consumer<byte[]> messageConsumer = createConsumer(name);
        try {
            return messageConsumer.receive().getData();
        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }


    }
    private Consumer<byte[]> createConsumer(String topicName) {
        try {
            return pulsarClient.newConsumer()
                    .topic(topicName)
                    .subscriptionName("A_2")
                    .subscriptionType(SubscriptionType.Exclusive)
                    .subscriptionInitialPosition(SubscriptionInitialPosition.Earliest)
                    .subscribe();
        } catch (PulsarClientException e) {
            throw new RuntimeException(e);
        }
    }

}
