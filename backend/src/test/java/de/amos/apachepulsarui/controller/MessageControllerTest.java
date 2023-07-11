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

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static java.util.Collections.emptyList;
import static org.hamcrest.Matchers.containsInAnyOrder;
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
        Set<MessageDto> messageDtos = Set.of(
                aMessage("persistent://public/default/spaceships", "Nebuchadnezzar"),
                aMessage("persistent://public/default/spaceships", "Serenity")
        );
        Mockito.when(messageService.getLatestMessagesFiltered("persistent://public/default/spaceships", 5, emptyList(), emptyList()))
                .thenReturn(messageDtos);

        mockMvc.perform(get("/messages?topic=persistent://public/default/spaceships&numMessages=5")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages", hasSize(2)))
                .andExpect(jsonPath("$.messages[*].payload", containsInAnyOrder("Nebuchadnezzar", "Serenity")));
    }

    @Test
    void getMessages_withoutNumMessages_returns10Messages() throws Exception {
        HashSet<MessageDto> messageDtos = new HashSet<>();
        for (int i = 0; i < 10; i++) {
            messageDtos.add(aMessage("persistent://public/default/test", "Test" + i));
        }

        Mockito.when(messageService.getLatestMessagesFiltered("persistent://public/default/test", 10,emptyList(),emptyList()))
                .thenReturn(messageDtos);

        mockMvc.perform(get("/messages?topic=persistent://public/default/test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages", hasSize(10)));
    }

    @Test
    void getMessages_withProducer_returns10Messages() throws Exception {
        HashSet<MessageDto> messageDtos = new HashSet<>();
        for (int i = 0; i < 10; i++) {
            messageDtos.add(aMessage("persistent://public/default/test", "Test" + i));
        }

        Mockito.when(messageService.getLatestMessagesFiltered("persistent://public/default/test", 10,List.of("pro"),emptyList()))
                .thenReturn(messageDtos);

        mockMvc.perform(get("/messages?topic=persistent://public/default/test&producers=pro")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages", hasSize(10)));
    }

    @Test
    void getMessages_withSubscription_returns10Messages() throws Exception {
        HashSet<MessageDto> messageDtos = new HashSet<>();
        for (int i = 0; i < 10; i++) {
            messageDtos.add(aMessage("persistent://public/default/test", "Test" + i));
        }

        Mockito.when(messageService.getLatestMessagesFiltered("persistent://public/default/test", 10,emptyList(),List.of("sub")))
                .thenReturn(messageDtos);

        mockMvc.perform(get("/messages?topic=persistent://public/default/test&subscriptions=sub")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.messages", hasSize(10)));
    }

    @Test
    void getMessages_withMissingQueryParameters_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/messages")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @NotNull
    private static MessageDto aMessage(String topic, String payload) {
        return MessageDto.create(topic, payload);
    }


}
