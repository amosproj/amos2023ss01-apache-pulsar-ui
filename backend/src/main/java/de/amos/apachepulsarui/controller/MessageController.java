/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.dto.MessagesDto;
import de.amos.apachepulsarui.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<MessagesDto> getMessages(@RequestParam String topic,
                                                   @RequestParam(required = false, defaultValue = "10") Integer numMessages,
                                                   @RequestParam(required = false, defaultValue = "") List<String> producers,
                                                   @RequestParam(required = false, defaultValue = "") List<String> subscriptions)
    {
        Set<MessageDto> messageDtos = messageService.getLatestMessagesFiltered(topic, numMessages, producers, subscriptions);
        return new ResponseEntity<>(new MessagesDto(messageDtos), HttpStatus.OK);
    }
}
