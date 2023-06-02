/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.cache.CacheManager;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PulsarContainer;
import org.testcontainers.utility.DockerImageName;

import java.util.Objects;


@SpringBootTest
@ContextConfiguration(initializers = {AbstractIntegrationTest.Initializer.class})
public class AbstractIntegrationTest {

    @Autowired
    private PulsarAdmin pulsarAdmin;

    @Autowired
    private CacheManager cacheManager;

    private static final PulsarContainer pulsar = new PulsarContainer(DockerImageName.parse("apachepulsar/pulsar:3.0.0"));

    static {
        // singleton containers that are re-used across sub-classes
        // see https://www.testcontainers.org/test_framework_integration/manual_lifecycle_control/#singleton-containers
        pulsar.start();
    }

    @BeforeEach
    void setUp() throws PulsarAdminException {
        var topics = pulsarAdmin.topics().getList("public/default");
        for (String topic : topics) {
            pulsarAdmin.topics().delete(topic);
        }

        cacheManager.getCacheNames()
                .forEach(cache -> Objects.requireNonNull(cacheManager.getCache(cache)).clear());
    }

    static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "pulsar.consumer.url=" + pulsar.getPulsarBrokerUrl(),
                    "pulsar.admin.url=" + pulsar.getHttpServiceUrl()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}
