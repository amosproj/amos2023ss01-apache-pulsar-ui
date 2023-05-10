package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.*;
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
     * @return A list of {@link ClusterDto}'s of Pulsar deployment with all topology elements till {@link TopicDto} level.
     * Returns maximum 10 topics per namespace.
     */
    @Cacheable("topology.topic_level")
    public List<ClusterDto> getTopicLevelTopology() {

        List<ClusterDto> allClusters = clusterService.getAllClusters();
        List<TenantDto> allTenants = tenantService.getAllTenants();

        return allClusters.stream()
                // tenants have not direct cluster mapping, but a list of allowed clusters,
                // so we need to map them manually
                .map(cluster -> this.determineTenants(cluster, allTenants))
                .map(this::enrichClustersTenantsWithNamespaces)
                .map(this::enrichClustersNamespacesWithTopics)
                .toList();
    }

    private ClusterDto determineTenants(ClusterDto cluster, List<TenantDto> tenants) {
        List<TenantDto> clustersTenants = tenants.stream()
                .filter(tenant -> tenant.getTenantInfo()
                        .getAllowedClusters()
                        .contains(cluster.getId()))
                .toList();
        return cluster.withTenants(clustersTenants);
    }

    private ClusterDto enrichClustersTenantsWithNamespaces(ClusterDto cluster) {
        List<TenantDto> tenants = cluster.getTenants().stream()
                .map(tenant -> tenant.toBuilder()
                        .namespaces(namespaceService.getAllOfTenant(tenant))
                        .build())
                .toList();
        return cluster.withTenants(tenants);
    }

    private ClusterDto enrichClustersNamespacesWithTopics(ClusterDto cluster) {

        List<TenantDto> tenants = cluster.getTenants().stream()
                .map(tenant -> {

                    List<NamespaceDto> namespaces = tenant.getNamespaces().stream()
                            .map(namespace -> {
                                List<TopicDto> topics = topicService.getByNamespace(namespace, MAX_INITIAL_TOPIC_COUNT);
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
