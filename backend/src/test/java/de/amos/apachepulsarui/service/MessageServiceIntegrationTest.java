/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Message;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.MessageId;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class MessageServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private TopicService topicService;

    //ToDo replace with a service to create subscriptions?
    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Test
    void peekMessages_returnsSentMessages() throws PulsarAdminException {
        topicService.createNewTopic("message-service-integration-test");
        String topicName = "persistent://public/default/message-service-integration-test";
        pulsarAdmin.topics().createSubscription(topicName, "getGreatMessages", MessageId.latest);
        Message message = Message.builder().payload("Hello World").topic(topicName).build();
        messageService.sendMessage(message);
        var messages = messageService.peekMessages(topicName);
        Assertions.assertThat(messages).containsExactly(message);
    }
}
