/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.common.naming.TopicName;

import javax.validation.constraints.NotEmpty;
import java.nio.charset.StandardCharsets;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageDto {

    String messageId;

    @NotEmpty
    String topic;

    @NotEmpty
    String payload;

    String schema;

    String namespace;

    String tenant;

    Long publishTime;

    /**
     * Static factory for messages already existing in Pulsar.
     */
    public static MessageDto fromExistingMessage(Message<byte[]> message, String schemaDefinition) {
        MessageDto messageDto = new MessageDto();
        String topicName = message.getTopicName();
        messageDto.messageId = message.getMessageId().toString();
        messageDto.topic = topicName;
        messageDto.payload = new String(message.getData(), StandardCharsets.UTF_8);
        messageDto.schema = schemaDefinition;
        messageDto.namespace = TopicName.get(topicName).getNamespacePortion();
        messageDto.tenant = TopicName.get(topicName).getTenant();
        messageDto.publishTime = message.getPublishTime();

        return messageDto;
    }


    /**
     * Static factory for messages meant to be sent to Pulsar.
     * They won't have a messageId (and further information yet).
     */
    public static MessageDto create(String topic, String payload) {
        MessageDto messageDto = new MessageDto();
        messageDto.topic = topic;
        messageDto.payload = payload;
        return messageDto;
    }

}
