/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.domain.Message;
import de.amos.apachepulsarui.dto.MessagesDto;
import de.amos.apachepulsarui.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RequestMapping("/message")
@Controller
@RequiredArgsConstructor
public class MessageController extends BaseController {
    private final MessageService messageService;

    @GetMapping("/{topicName}/messages")
    public ResponseEntity<MessagesDto> getMessagesByTopic(@PathVariable String topicName) {

        List<Message> messages = messageService.getMessagesByTopicName(topicName);
        return new ResponseEntity<>(MessagesDto.fromMessages(messages), HttpStatus.OK);
    }

}
