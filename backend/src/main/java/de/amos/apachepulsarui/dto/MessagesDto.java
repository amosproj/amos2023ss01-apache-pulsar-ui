/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@AllArgsConstructor
@Data
public class MessagesDto {

    private List<MessageDto> messageDtos;

    public static MessagesDto fromMessages(List<MessageDto> messages) {
        var messageDtos = messages.stream()
                .map(message -> new MessageDto(message.getMessageId(), message.getPayload(), message.getTopic()))
                .toList();
        return new MessagesDto(messageDtos);
    }

}
