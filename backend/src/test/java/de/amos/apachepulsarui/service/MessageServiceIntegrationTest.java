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

import java.nio.charset.StandardCharsets;
import java.util.Base64;

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
        Message message = new Message("1", base64Encode("Hello World"), topicName);
        messageService.sendMessage(message);
        var messages = messageService.peekMessages(topicName);
        // TODO why is the key null?
        Assertions.assertThat(messages).containsExactly(new Message(null, "Hello World", topicName));
    }

    private static String base64Encode(String payload) {
        return Base64.getEncoder().encodeToString(payload.getBytes(StandardCharsets.UTF_8));
    }

}
