/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.service.MessageService;
import org.jetbrains.annotations.NotNull;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MessageController.class)
public class MessageControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    MessageService messageService;

    @Test
    void getMessages_returnsMessages() throws Exception {
        List<MessageDto> messageDtos = List.of(
                aMessage("persistent://public/default/spaceships", "Nebuchadnezzar"),
                aMessage("persistent://public/default/spaceships", "Serenity")
        );
        Mockito.when(messageService.getNumberOfLatestMessagesFromTopic("persistent://public/default/spaceships", 5))
                .thenReturn(messageDtos);

        mockMvc.perform(get("/messages?topic=persistent://public/default/spaceships&numOfLatestMsgs=5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages", hasSize(2)))
                .andExpect(jsonPath("$.messages[0].payload", equalTo("Nebuchadnezzar")))
                .andExpect(jsonPath("$.messages[1].payload", equalTo("Serenity")));
    }

    @NotNull
    private static MessageDto aMessage(String topic, String payload) {
        return MessageDto.create(topic, payload);
    }

    @Test
    void getMessages_withMissingQueryParameters_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/messages")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
