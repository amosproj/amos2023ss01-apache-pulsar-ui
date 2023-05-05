/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.startup;

import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.admin.Topics;
import org.apache.pulsar.client.api.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.context.event.ApplicationReadyEvent;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationStartupListenerTest {

    @Mock
    private PulsarAdmin pulsarAdmin;

    @Mock
    private PulsarClient pulsarClient;

    @Mock
    private Producer<byte[]> producer;

    @Mock
    private ApplicationReadyEvent applicationReadyEvent;

    @Mock
    private ProducerBuilder<byte []> producerBuilder;

    @Mock
    private ConsumerBuilder<byte []> consumerBuilder;

    @Mock
    private Topics topics;

    @Mock
    private TypedMessageBuilder<byte []> typedMessageBuilder;

    @InjectMocks
    private ApplicationStartupListener applicationStartupListener;

    @Test
    void onApplicationReadyEvent() throws PulsarAdminException, PulsarClientException {
        whenDeleteOldTopic();
        whenNewProducer();
        whenNewMessage();
        whenNewConsumer();
        when(pulsarAdmin.topics()).thenReturn(topics);

        applicationStartupListener.onApplicationReadyEvent(applicationReadyEvent);

        verify(pulsarAdmin.topics(), times(5)).createNonPartitionedTopic(any());
        verify(pulsarClient.newConsumer().topic(any()).consumerName(any()).subscriptionType(SubscriptionType.Shared), times(5)).subscribe();
        verify(pulsarAdmin.topics(), times(3)).delete(any());
        verify(producer, times(52)).newMessage();
    }

    private void whenNewProducer() throws PulsarClientException {
        when(pulsarClient.newProducer()).thenReturn(producerBuilder);
        when(pulsarClient.newProducer().topic(any())).thenReturn(producerBuilder);
        when(pulsarClient.newProducer().topic(any()).compressionType(CompressionType.LZ4)).thenReturn(producerBuilder);
        when(pulsarClient.newProducer().topic(any()).compressionType(CompressionType.LZ4).create()).thenReturn(producer);

    }

    private void whenNewMessage() {
        when(producer.newMessage()).thenReturn(typedMessageBuilder);
        when(producer.newMessage().key(any())).thenReturn(typedMessageBuilder);
        when(producer.newMessage().key(any()).value(any())).thenReturn(typedMessageBuilder);
    }

    private void whenNewConsumer() {
        when(pulsarClient.newConsumer()).thenReturn(consumerBuilder);
        when(pulsarClient.newConsumer().topic(any())).thenReturn(consumerBuilder);
        when(pulsarClient.newConsumer().topic(any()).consumerName(any())).thenReturn(consumerBuilder);
        when(pulsarClient.newConsumer().topic(any()).consumerName(any()).subscriptionType(SubscriptionType.Shared)).thenReturn(consumerBuilder);
        when(pulsarClient.newConsumer().topic(any()).consumerName(any()).subscriptionType(SubscriptionType.Shared).subscriptionName(any())).thenReturn(consumerBuilder);

    }

    private void whenDeleteOldTopic () throws PulsarAdminException {
        List<String> oldTopics = List.of("Tick", "Trick", "Track");
        when(pulsarAdmin.topics()).thenReturn(topics);
        when(pulsarAdmin.topics().getList("public/default")).thenReturn(oldTopics);

    }
}