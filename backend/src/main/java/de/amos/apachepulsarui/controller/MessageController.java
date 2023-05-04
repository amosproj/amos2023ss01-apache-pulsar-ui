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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<MessagesDto> getMessages(@RequestParam String topic, @RequestParam String subscription) {
        List<Message> messages = messageService.peekMessages(topic, subscription);
        return new ResponseEntity<>(MessagesDto.fromMessages(messages), HttpStatus.OK);
    }

    @PostMapping(
            value = "/send",
            consumes = {MediaType.APPLICATION_JSON_VALUE}
    )
    public ResponseEntity<Void> sendMessage(@RequestBody Message message) {
        if (!messageService.isValidMessage(message)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (messageService.sendMessage(message)) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
