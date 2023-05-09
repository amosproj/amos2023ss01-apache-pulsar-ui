package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Cluster;
import de.amos.apachepulsarui.domain.Namespace;
import de.amos.apachepulsarui.domain.Tenant;
import de.amos.apachepulsarui.domain.Topic;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
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
    @Cacheable("topology.topic_level")
    public List<Cluster> getTopicLevelTopology() {

        List<Cluster> allClusters = clusterService.getAllClusters();
        List<Tenant> allTenants = tenantService.getAllTenants();

        return allClusters.stream()
                // tenants have not direct cluster mapping, but a list of allowed clusters,
                // so we need to map them manually
                .map(cluster -> this.determineTenants(cluster, allTenants))
                .map(this::enrichClustersTenantsWithNamespaces)
                .map(this::enrichClustersNamespacesWithTopics)
                .toList();
    }

    private Cluster determineTenants(Cluster cluster, List<Tenant> tenants) {
        List<Tenant> clustersTenants = tenants.stream()
                .filter(tenant -> tenant.getTenantInfo()
                        .getAllowedClusters()
                        .contains(cluster.getId()))
                .toList();
        return cluster.withTenants(clustersTenants);
    }

    private Cluster enrichClustersTenantsWithNamespaces(Cluster cluster) {
        List<Tenant> tenants = cluster.getTenants().stream()
                .map(tenant -> tenant.toBuilder()
                        .namespaces(namespaceService.getAllOfTenant(tenant))
                        .build())
                .toList();
        return cluster.withTenants(tenants);
    }

    private Cluster enrichClustersNamespacesWithTopics(Cluster cluster) {

        List<Tenant> tenants = cluster.getTenants().stream()
                .map(tenant -> {

                    List<Namespace> namespaces = tenant.getNamespaces().stream()
                            .map(namespace -> {
                                List<Topic> topics = topicService.getByNamespace(namespace, MAX_INITIAL_TOPIC_COUNT);
                                return namespace.toBuilder()
                                        .topics(topics)
                                        .build();
                            })
                            .toList();

                    return tenant.toBuilder()
                            .namespaces(namespaces)
                            .build();
                })
                .toList();

        return cluster.withTenants(tenants);
    }

}
