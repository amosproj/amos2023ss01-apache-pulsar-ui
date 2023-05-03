/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TopicsDto;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/topic")
public class TopicController extends BaseController{

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<TopicsDto> getAllTopics() {
        return new ResponseEntity<>(new TopicsDto(topicService.getAllTopics()), HttpStatus.OK);
    }
}