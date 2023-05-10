/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;


@AllArgsConstructor
@Data
public class MessagesDto {

    private List<MessageDto> messages;

    public static MessagesDto fromMessages(List<MessageDto> messages) {
		List<MessageDto> messageDtos = messages.stream()
											   .map(message -> MessageDto.fromExistingMessage(
															message.getMessageId(),
															message.getPayload(),
															message.getTopic()
													)
											   )
											   .toList();
        return new MessagesDto(messageDtos);
    }

}
