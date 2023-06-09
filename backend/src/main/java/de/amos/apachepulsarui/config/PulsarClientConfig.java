/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.config;

import de.amos.apachepulsarui.exception.PulsarApiException;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PulsarClientConfig {

    @Value("${pulsar.consumer.url}")
    private String pulsarConnectionUrl;

    @Bean
    public PulsarClient buildClient() throws PulsarApiException {
        try {
            return PulsarClient.builder()
                    .serviceUrl(pulsarConnectionUrl)
                    .build();
        } catch (PulsarClientException e) {
            throw new PulsarApiException(
                    "Could not initialize a pulsar client while trying to connect to %s".formatted(pulsarConnectionUrl),
                    e
            );
        }
    }

}
