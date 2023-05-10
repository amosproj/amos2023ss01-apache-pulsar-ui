/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import java.util.List;

import lombok.Data;


@Data
public class MessagesDto {

    private List<MessageDto> messages;

    public static MessagesDto fromMessages(List<MessageDto> messages) {
		MessagesDto messagesDto = new MessagesDto();
		messagesDto.setMessages(messages);
		return messagesDto;
	}

}
