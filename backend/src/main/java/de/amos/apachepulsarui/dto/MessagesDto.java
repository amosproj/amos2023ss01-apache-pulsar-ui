/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import de.amos.apachepulsarui.domain.Message;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@AllArgsConstructor
@Data
public class MessagesDto {

    private List<MessageDto> messages;

    public static MessagesDto fromMessages(List<Message> messages) {
        var messageDtos = messages.stream()
                .map(message -> new MessageDto(message.getKey(), message.getPayload()))
                .toList();
        return new MessagesDto(messageDtos);
    }

}
