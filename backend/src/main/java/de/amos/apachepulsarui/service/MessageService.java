/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.common.api.proto.CommandSubscribe;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class MessageService {
    private final PulsarAdmin pulsarAdmin;

    public List<MessageDto> getLatestMessagesOfTopic(String topic, Integer numMessages) {
        var schema = getSchemaIfExists(topic);
        try {
            var messages = new ArrayList<Message<byte[]>>();

            // ensure that we don't look up more messages than exist
            var producedMessagesUntilNow = pulsarAdmin.topics().getStats(topic).getMsgInCounter();
            var numLookUpMessages = Math.min(producedMessagesUntilNow, numMessages);

            for (int i = 0; i < numLookUpMessages; i++) {
                messages.add(
                        pulsarAdmin.topics()
                                .examineMessage(topic, CommandSubscribe.InitialPosition.Latest.name(), i));
            }
            return messages.stream()
                    .map(message -> MessageDto.fromExistingMessage(message, schema))
                    .toList();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not examine the amount of '%d' messages for topic '%s'".formatted(numMessages, topic),
                    e
            );
        }
    }

    private String getSchemaIfExists(String topic) {
        try {
            return pulsarAdmin.schemas().getSchemaInfo(topic).getSchemaDefinition();
        } catch (PulsarAdminException e) {
            return "";
        }
    }

    public boolean inValidTopicName(MessageDto messageDto) {
        return !TopicName.isValid(messageDto.getTopic());
    }
}
