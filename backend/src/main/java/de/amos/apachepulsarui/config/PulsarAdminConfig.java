/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.config;

import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.api.PulsarClientException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PulsarAdminConfig {

    @Value("${pulsar.admin.url}")
    private String adminUrl;

    @Bean
    public PulsarAdmin createPulsarAdmin() throws PulsarClientException {
        boolean tlsAllowInsecureConnection = false;
        String tlsTrustCertsFilePath = null;
        return PulsarAdmin.builder()
                .serviceHttpUrl(adminUrl)
                .tlsTrustCertsFilePath(tlsTrustCertsFilePath)
                .allowTlsInsecureConnection(tlsAllowInsecureConnection)
                .build();
    }

}
