/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.dto.TopicsDto;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.common.naming.NamespaceName;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController {

    private final TenantService tenantService;
    private final NamespaceService namespaceService;
    private final TopicService topicService;

    // Talked about this with Julian - probably we won't use it this way later, but at first it's easier for them
    // to just get all topics at once.
    @GetMapping
    public ResponseEntity<TopicsDto> getAll() {
        List<TopicDto> allTopics = tenantService.getAllTenants().stream()
                .flatMap(tenantDto -> namespaceService.getAllOfTenant(tenantDto).stream())
                .flatMap(namespaceDto -> topicService.getAllByNamespace(namespaceDto.getId()).stream())
                .toList();
        return new ResponseEntity<>(new TopicsDto(allTopics), HttpStatus.OK);
    }

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
