/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.startup;

import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.dto.MessageDto;
import de.amos.apachepulsarui.dto.TopicDto;
import de.amos.apachepulsarui.service.ClusterService;
import de.amos.apachepulsarui.service.MessageService;
import de.amos.apachepulsarui.service.TopicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.MessageId;
import org.apache.pulsar.common.naming.NamespaceName;
import org.apache.pulsar.common.naming.TopicDomain;
import org.apache.pulsar.common.naming.TopicName;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
@Slf4j
public class ApplicationStartupListener {

    private static final List<String> topics = List.of(
            "foo",
            "bar",
            "foobar",
            "fizz",
            "buzz",
            "fizzbuzz"
    );

    private static final List<String> namespaces = List.of(
            "customers",
            "suppliers",
            "sales",
            "marketing",
            "hr"
    );

    private static final List<String> tenants = List.of(
            "us-tenant",
            "eu-tenant"
    );

    private final PulsarAdmin pulsarAdmin;
    private final ClusterService clusterService;
    private final TopicService topicService;
    private final MessageService messageService;

    @EventListener
    public void onApplicationReadyEvent(ApplicationReadyEvent event) throws PulsarAdminException {
        this.flushApplication();
        this.fuelPulsar();
    }

    private void flushApplication() throws PulsarAdminException {
        for (TopicDto topic : topicService.getAllTopics()) {
            pulsarAdmin.topics().delete(topic.getName());
        }
        for (String tenant : tenants) {

            for (String namespace : namespaces) {
                pulsarAdmin.namespaces().deleteNamespace(NamespaceName.get(tenant, namespace).toString());
            }

            pulsarAdmin.tenants().deleteTenant(tenant);
        }
    }

    private void fuelPulsar() throws PulsarAdminException {
        // create tenants
        for (String tenant : tenants) {
            TenantInfo tenantInfo = TenantInfo.builder()
                    // we just allow all clusters for now
                    .allowedClusters(clusterService.getAllClusters().stream()
                            .map(ClusterDto::getId)
                            .collect(Collectors.toSet()))
                    .build();
            pulsarAdmin.tenants().createTenant(tenant, tenantInfo);

            // create namespaces
            for (String namespace : namespaces) {
                // see https://pulsar.apache.org/docs/2.11.x/concepts-messaging/#namespaces
                // for info on how to build namespace names
                pulsarAdmin.namespaces().createNamespace(NamespaceName.get(tenant, namespace).toString());
            }

        }

        // create topics for each tenant and namespace
        ArrayList<TopicName> topicNames = new ArrayList<>();
        topicNames.ensureCapacity(tenants.size() * namespaces.size() * topics.size());

        for (String tenant : tenants) {
            for (String namespace : namespaces) {
                for (String topic : topics) {

                    TopicName topicName = TopicName.get(TopicDomain.persistent.value(), tenant, namespace, topic);
                    topicService.createNewTopic(topicName.toString());

                    log.info("Topic " + topicName + " created");
                    topicNames.add(topicName);
                }
            }
        }

        // send 100 messages in each of these topics
        for (TopicName topicName : topicNames) {

            List<MessageDto> messages = IntStream.rangeClosed(0, 10)
                    .mapToObj(i -> MessageDto.create(
                            topicName.toString(),
                            RandomString.make()
                    ))
                    .toList();

            messageService.sendMessages(messages);
            log.info("10 Messages sent to topic %s.".formatted(topicName));

            // create subscriptions for these topics that we are able to retrieve their messages
            pulsarAdmin.topics().createSubscription(
                    topicName.toString(),
                    topicName.getLocalName() + "-sub",
                    MessageId.earliest
            );
            log.info("Subscription created for topic %s.".formatted(topicName));

        }

    }

}
