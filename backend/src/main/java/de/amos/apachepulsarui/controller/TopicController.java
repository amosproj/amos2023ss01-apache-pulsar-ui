/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController extends BaseController{

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<String>> getAllTopics() {
        return new ResponseEntity<>(topicService.getAllTopics(), HttpStatus.OK);
    }

    @GetMapping("/{name}/messages")
    public ResponseEntity<List<MessageDto>> getMessagesByTopic(@PathVariable String name) {
        return new ResponseEntity<>(topicService.getMessagesByTopicName(name), HttpStatus.OK);
    }
}
