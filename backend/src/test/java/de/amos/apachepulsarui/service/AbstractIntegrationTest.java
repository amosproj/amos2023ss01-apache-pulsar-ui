/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.startup.ApplicationStartupListener;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.PulsarContainer;
import org.testcontainers.utility.DockerImageName;


@SpringBootTest
@ContextConfiguration(initializers = {AbstractIntegrationTest.Initializer.class})
public class AbstractIntegrationTest {

    // mocking this to avoid dummy data creation on startup
    @MockBean
    private ApplicationStartupListener applicationStartupListener;

    @Autowired
    private PulsarAdmin pulsarAdmin;

    private static final PostgreSQLContainer<?> postgreSQLContainer = new PostgreSQLContainer<>("postgres:latest")
            .withDatabaseName("apache_pulsar")
            .withUsername("username")
            .withPassword("password");

    private static final PulsarContainer pulsar = new PulsarContainer(DockerImageName.parse("apachepulsar/pulsar:latest"));

    static {
        // singleton containers that are re-used across sub-classes
        // see https://www.testcontainers.org/test_framework_integration/manual_lifecycle_control/#singleton-containers
        postgreSQLContainer.start();
        pulsar.start();
    }

    @BeforeEach
    void setUp() throws PulsarAdminException {
        var topics = pulsarAdmin.topics().getList("public/default");
        for (String topic : topics) {
            pulsarAdmin.topics().delete(topic);
        }
    }

    static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + postgreSQLContainer.getJdbcUrl(),
                    "spring.datasource.username=" + postgreSQLContainer.getUsername(),
                    "spring.datasource.password=" + postgreSQLContainer.getPassword(),
                    "pulsar.consumer.url=" + pulsar.getPulsarBrokerUrl(),
                    "pulsar.admin.url=" + pulsar.getHttpServiceUrl()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }
}