/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.config;

import lombok.SneakyThrows;
import org.apache.pulsar.client.api.PulsarClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PulsarClientConfig {

    @Value("${pulsar.consumer.url}")
    private String pulsarConnectionUrl;

    @Bean
    @SneakyThrows
    public PulsarClient buildClient() {
        return PulsarClient.builder()
                .serviceUrl(pulsarConnectionUrl)
                .build();
    }

}
