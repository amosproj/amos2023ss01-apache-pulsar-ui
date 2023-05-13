/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.config;

import lombok.SneakyThrows;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PulsarAdminConfig {

    @Value("${pulsar.admin.url}")
    private String adminUrl;

    @Bean
    @SneakyThrows
    public PulsarAdmin createPulsarAdmin() {
        boolean tlsAllowInsecureConnection = false;
        String tlsTrustCertsFilePath = null;
        return PulsarAdmin.builder()
                .serviceHttpUrl(adminUrl)
                .tlsTrustCertsFilePath(tlsTrustCertsFilePath)
                .allowTlsInsecureConnection(tlsAllowInsecureConnection)
                .build();
    }

}
