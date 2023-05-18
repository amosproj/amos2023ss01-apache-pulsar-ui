package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.dto.TopicDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.ClusterData;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClusterService {

    private final PulsarAdmin pulsarAdmin;
    private final TenantService tenantService;
    private final NamespaceService namespaceService;
    private final TopicService topicService;

    /**
     * @return A list of {@link ClusterDto}'s of Pulsar deployment with all topology elements till {@link TopicDto}
     * level.
     */
    @Cacheable("getAllClusters")
    public List<ClusterDto> getAllClusters() throws PulsarAdminException {
        return pulsarAdmin.clusters().getClusters().stream()
                .map(ClusterDto::fromString)
                .map(this::enrichWithClusterData)
                .map(this::enrichWithBrokerData)
                .map(this::enrichWithTopologyElements)
                .toList();
    }

    private ClusterDto enrichWithClusterData(ClusterDto cluster) {
        try {
            ClusterData clusterData = pulsarAdmin.clusters().getCluster(cluster.getId());
            cluster.setBrokerServiceUrl(clusterData.getBrokerServiceUrl());
            cluster.setServiceUrl(clusterData.getServiceUrl());
            return cluster;
        } catch (PulsarAdminException e) {
            log.error("Could not fetch fetch cluster data of cluster %s. E: %s".formatted(cluster.getId(), e));
            return cluster;
        }
    }

    private ClusterDto enrichWithBrokerData(ClusterDto cluster) {
        try {
            cluster.setBrokers(pulsarAdmin.brokers().getActiveBrokers(cluster.getId()));
            return cluster;
        } catch (PulsarAdminException e) {
            log.error("Could not fetch fetch active brokers of cluster %s. E: %s".formatted(cluster.getId(), e));
            return cluster;
        }
    }

    /**
     * Aggregates the topology elements by iterating in a breadth-first search manner top-down:
     * all clusters
     * -> tenants (all of cluster)
     * -> namespaces (all of tenant)
     * -> topics (all of namespace)
     *
     * @return A list of nested topology elements from clusters till namespaces.
     */
    private ClusterDto enrichWithTopologyElements(ClusterDto cluster) {

        List<TenantDto> tenantsWithNamespacesAndTopics = tenantService.getAllTenants().stream()
                // filter all tenants for those that are allowed for our cluster
                .filter(tenant -> tenant.getTenantInfo()
                        .getAllowedClusters()
                        .contains(cluster.getId()))
                // set all the namespaces of a tenant
                .peek(tenant -> {
                    List<NamespaceDto> namespacesOfTenant = namespaceService.getAllOfTenant(tenant).stream()
                            // for each namespace of a tenant, we fetch all topics
                            .peek(namespace -> {
                                List<String> topicsOfNamespace = topicService.getAllNamesByNamespace(namespace.getId());
                                namespace.setTopics(topicsOfNamespace);
                            })
                            .toList();
                    tenant.setNamespaces(namespacesOfTenant);
                })
                .toList();

        cluster.setTenants(tenantsWithNamespacesAndTopics);
        return cluster;
    }

}
