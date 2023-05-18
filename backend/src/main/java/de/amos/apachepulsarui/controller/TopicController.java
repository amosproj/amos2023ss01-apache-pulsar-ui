/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.dto.TopicsDto;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.common.naming.NamespaceName;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/{tenant}/{namespace}")
    public ResponseEntity<TopicsDto> getTopicsByNamespace(@PathVariable String namespace, @PathVariable String tenant) {
        String namespaceName = NamespaceName.get(tenant, namespace).toString();
        return new ResponseEntity<>(new TopicsDto(topicService.getAllByNamespace(namespaceName)), HttpStatus.OK);
    }

    @GetMapping("/{topic}")
    public ResponseEntity<TopicDto> getTopicWithMessagesByName(@PathVariable String topic) {
       return new ResponseEntity<>(topicService.getTopicWithMessagesByName(topic), HttpStatus.OK);
    }

    @PostMapping("/new")
    public ResponseEntity<Void> newTopic(@RequestParam String topic) {
        if (!TopicName.isValid(topic)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (topicService.createNewTopic(topic)) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
