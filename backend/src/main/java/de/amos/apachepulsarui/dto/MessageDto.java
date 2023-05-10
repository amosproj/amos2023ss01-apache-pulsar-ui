/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.dto;

import java.nio.charset.StandardCharsets;

import javax.validation.constraints.NotEmpty;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pulsar.client.api.Message;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageDto {

    String messageId;

    @NotEmpty
    String topic;

	@NotEmpty
	String payload;

	/**
	 * Static factory for messages already existing in Pulsar.
	 */
	public static MessageDto fromExistingMessage(Message<byte []> message) {
		MessageDto messageDto = new MessageDto();
		messageDto.messageId = message.getMessageId().toString();
		messageDto.topic = message.getTopicName();
		messageDto.payload = new String(message.getData(), StandardCharsets.UTF_8);
		return messageDto;
	}

	/**
	 * Static factory for messages already existing in Pulsar.
	 * @apiNote For testing purposes.
	 */
	public static MessageDto fromExistingMessage(String messageId, String topic, String payload) {
		MessageDto messageDto = new MessageDto();
		messageDto.messageId = messageId;
		messageDto.topic = topic;
		messageDto.payload = payload;
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
