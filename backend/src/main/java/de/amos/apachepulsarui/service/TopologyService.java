package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Cluster;
import de.amos.apachepulsarui.domain.Topic;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Scope("singleton")
@RequiredArgsConstructor
@Slf4j
public class TopologyService {

    private static final int MAX_INITIAL_TOPIC_COUNT = 10;

    private final ClusterService clusterService;
    private final TenantService tenantService;
    private final NamespaceService namespaceService;
    private final TopicService topicService;

    /**
     * @return A list of {@link Cluster}'s of Pulsar deployment with all topology elements till {@link Topic} level.
     * Returns maximum 10 topics per namespace.
     */
    public List<Cluster> getTopicLevelTopology() {
        return clusterService.getAllClusters().stream()
                .map(cluster -> cluster.toBuilder()
                        .tenants(tenantService.getAllTenants().stream()
                                .map(tenant -> tenant.toBuilder()
                                        .namespaces(namespaceService.getAllNamespaces().stream()
                                                .map(namespace -> namespace.toBuilder()
                                                        .topics(topicService.getByNamespace(
                                                                namespace, MAX_INITIAL_TOPIC_COUNT
                                                        ))
                                                        .build())
                                                .toList())
                                        .build())
                                .toList())
                        .build())
                .toList();
    }

}
