package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.controller.exception.PulsarApiException;
import de.amos.apachepulsarui.dto.ClusterDto;
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
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClusterService {

    private final PulsarAdmin pulsarAdmin;
    private final TenantService tenantService;
    private final NamespaceService namespaceService;

    /**
     * @return A list of {@link ClusterDto}'s of Pulsar deployment with all topology elements till {@link TopicDto}
     * level.
     */
    @Cacheable("getAllClusters")
    public List<ClusterDto> getAllClusters() throws PulsarApiException {
        try {
            return pulsarAdmin.clusters().getClusters().stream().map(ClusterDto::fromString).map(this::enrichWithClusterData).map(this::enrichWithBrokerData).map(this::enrichWithTopologyElements).collect(Collectors.toList());
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch list a list of all clusters.", e);
        }
    }

    private ClusterDto enrichWithClusterData(ClusterDto cluster) throws PulsarApiException {
        try {
            ClusterData clusterData = pulsarAdmin.clusters().getCluster(cluster.getId());
            cluster.setBrokerServiceUrl(clusterData.getBrokerServiceUrl());
            cluster.setServiceUrl(clusterData.getServiceUrl());
            return cluster;
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch fetch cluster data of cluster '%s'".formatted(cluster.getId()), e
            );
        }
    }

    private ClusterDto enrichWithBrokerData(ClusterDto cluster) throws PulsarApiException {
        try {
            cluster.setBrokers(pulsarAdmin.brokers().getActiveBrokers(cluster.getId()));
            return cluster;
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch fetch active brokers of cluster '%s'".formatted(cluster.getId()), e
            );
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
                .peek(tenant -> tenant.setNamespaces(namespaceService.getAllOfTenant(tenant)))
                .toList();

        cluster.setTenants(tenantsWithNamespacesAndTopics);
        return cluster;
    }

}
