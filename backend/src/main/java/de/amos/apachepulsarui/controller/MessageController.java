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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<MessagesDto> getMessages(@RequestParam String topic, @RequestParam String subscription) {
        List<MessageDto> messageDtos = messageService.peekMessages(topic, subscription);
        return new ResponseEntity<>(new MessagesDto(messageDtos), HttpStatus.OK);
    }

    @PostMapping(
            value = "/send",
            consumes = {MediaType.APPLICATION_JSON_VALUE}
    )
    public ResponseEntity<Void> sendMessage(@RequestBody @Valid MessageDto messageDto) {
        if (messageService.inValidTopicName(messageDto)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (messageService.sendMessage(messageDto)) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
