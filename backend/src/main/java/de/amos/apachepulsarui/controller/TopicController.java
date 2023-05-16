/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.dto.TopicsDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController {

    private final TopicService topicService;

    private final NamespaceService namespaceService;

    @GetMapping
    public ResponseEntity<TopicsDto> getAllTopics() {
        List<NamespaceDto> namespaces = namespaceService.getAll();
        List<TopicDto> topics = namespaces.stream()
                .flatMap(namespace -> topicService.getByNamespace(namespace).stream())
                .toList();
        return new ResponseEntity<>(new TopicsDto(topics), HttpStatus.OK);
    }

    @PostMapping("/new")
    public ResponseEntity<Void> newTopic(@RequestParam String topic) {
        if (!topicService.isValidTopic(topic)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (topicService.createNewTopic(topic)) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
