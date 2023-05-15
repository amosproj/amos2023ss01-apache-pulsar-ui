package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.dto.TopicDto;
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
                .peek(cluster -> {

					List<TenantDto> clustersTenants = this.determineTenants(cluster, allTenants);
					List<TenantDto> tenantsWithNamespaces = this.enrichWithNamespaces(clustersTenants);
					List<TenantDto> tenantsWithNamespacesAndTopics = this.enrichNamespacesWithTopics(tenantsWithNamespaces);

					cluster.setTenants(tenantsWithNamespacesAndTopics);
				})
                .toList();
    }

    private List<TenantDto> determineTenants(ClusterDto cluster, List<TenantDto> tenants) {
        return tenants.stream()
                .filter(tenant -> tenant.getTenantInfo()
                        .getAllowedClusters()
                        .contains(cluster.getId()))
                .toList();
    }

    private List<TenantDto> enrichWithNamespaces(List<TenantDto> tenants) {
        return tenants.stream()
                .peek(tenant -> tenant.setNamespaces(namespaceService.getAllOfTenant(tenant)))
                .toList();
    }

    private List<TenantDto> enrichNamespacesWithTopics(List<TenantDto> tenants) {
		return tenants.stream()
                .peek(tenant -> {
                    List<NamespaceDto> namespaces = tenant.getNamespaces().stream()
                            .peek(namespace -> namespace.setTopics(topicService.getByNamespace(namespace, MAX_INITIAL_TOPIC_COUNT)))
                            .toList();
                    tenant.setNamespaces(namespaces);
				})
                .toList();
    }

}
