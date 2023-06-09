/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.*;
import de.amos.apachepulsarui.service.NamespaceService;
import de.amos.apachepulsarui.service.TenantService;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.common.naming.TopicName;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController {

    private final TopicService topicService;

    private final TenantService tenantService;

    private final NamespaceService namespaceService;

    @GetMapping("/all")
    public ResponseEntity<TopicsDto> getAll(@RequestParam(required = false, defaultValue = "") List<String> tenants,
                                            @RequestParam(required = false, defaultValue = "") List<String> namespaces,
                                            @RequestParam(required = false, defaultValue = "") List<String> topics) {
        if (!topics.isEmpty()) {
            return wrapInEntity(getAllForTopics(topics));
        } else if (!namespaces.isEmpty()) {
            return wrapInEntity(getAllForNamespaces(namespaces));
        } else {
            return wrapInEntity(getAllForTenants(tenants));
        }
    }

    @GetMapping
    public ResponseEntity<TopicDetailDto> getTopicDetails(@RequestParam String name) {
       return new ResponseEntity<>(topicService.getTopicDetails(name), HttpStatus.OK);
    }

    @GetMapping("/subscription/{subscription}")
    public ResponseEntity<SubscriptionDto> getSubscriptionByNameAndTopic(@RequestParam String topic, @PathVariable String subscription) {
        return new ResponseEntity<>(topicService.getSubscriptionByTopic(topic, subscription), HttpStatus.OK);
    }

    @GetMapping("/producer/{producer}")
    public ResponseEntity<ProducerDto> getProducerByNameAndTopic(@RequestParam String topic, @PathVariable String producer) {
        return new ResponseEntity<>(topicService.getProducerByTopic(topic, producer), HttpStatus.OK);
    }

    @GetMapping("/consumer/{consumer}")
    public ResponseEntity<ConsumerDto> getConsumerByNameAndTopic(@RequestParam String topic, @PathVariable String consumer) {
        return new ResponseEntity<>(topicService.getConsumerByTopic(topic, consumer), HttpStatus.OK);
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

    private ResponseEntity<TopicsDto> wrapInEntity(List<TopicDto> topicDtos) {
        return new ResponseEntity<>(new TopicsDto(topicDtos), HttpStatus.OK);
    }

    private List<TopicDto> getAllForTopics(List<String> topics) {
        return topicService.getAllForTopics(topics);
    }

    private List<TopicDto> getAllForNamespaces(List<String> namespaces) {
        return topicService.getAllForNamespaces(namespaces);
    }

    private List<TopicDto> getAllForTenants(List<String> tenants) {
        if (tenants.isEmpty()) {
            tenants = tenantService.getAllNames();
        }
        List<String> namespaces = namespaceService.getNamespaceNamesForTenants(tenants);
        return topicService.getAllForNamespaces(namespaces);
    }

}
