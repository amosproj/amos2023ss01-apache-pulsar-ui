/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
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
        topicService.createNewTopic("messageDto-service-integration-test");
        String topicName = "persistent://public/default/messageDto-service-integration-test";
        pulsarAdmin.topics().createSubscription(topicName, "getGreatMessages", MessageId.latest);
        MessageDto messageDto = MessageDto.builder()
                .messageId("1:0:-1") // pulsar will auto-generate this!
                .payload("Hello World")
                .topic(topicName)
                .build();
        messageService.sendMessage(messageDto);
        var messages = messageService.peekMessages(topicName);
        Assertions.assertThat(messages).containsExactly(messageDto);
    }
}
