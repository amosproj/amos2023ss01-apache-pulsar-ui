package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.ClusterDetailDto;
import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.ClusterData;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClusterService {

    private final PulsarAdmin pulsarAdmin;
    private final TenantService tenantService;
    private final NamespaceService namespaceService;

    @Cacheable("cluster.allNames")
    public List<ClusterDto> getAllNames() {
        try {
            return pulsarAdmin.clusters().getClusters().stream()
                    .map(ClusterDto::create)
                    .map(this::enrichWithCardDetails)
                    .toList();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch list a list of all clusters", e);
        }
    }

    @Cacheable("cluster.detail")
    public ClusterDetailDto getClusterDetails(String clusterName) {

        ClusterData clusterData = getClusterData(clusterName);
        List<String> activeBrokers = getActiveBrokers(clusterName);
        List<String> tenantsAllowedForCluster = getTenantsAllowedForCluster(clusterName);
        return ClusterDetailDto.builder()
                .name(clusterName)
                .serviceUrl(clusterData.getServiceUrl())
                .brokerServiceUrl(clusterData.getBrokerServiceUrl())
                .brokers(activeBrokers)
                .amountOfBrokers(activeBrokers.size())
                .tenants(tenantsAllowedForCluster)
                .build();
    }

    private ClusterData getClusterData(String clusterName) throws PulsarApiException {
        try {
            return pulsarAdmin.clusters().getCluster(clusterName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch fetch cluster data of cluster '%s'".formatted(clusterName), e
            );
        }
    }

    private List<String> getActiveBrokers(String clusterName) throws PulsarApiException {
        try {
            return pulsarAdmin.brokers().getActiveBrokers(clusterName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch fetch active brokers of cluster '%s'".formatted(clusterName), e
            );
        }
    }

    private List<String> getTenantsAllowedForCluster(String clusterName) throws PulsarApiException {
        return tenantService.getAllNames().stream()
                .filter(tenantName -> {
                    try {
                        Set<String> allowedClusters = pulsarAdmin.tenants()
                                .getTenantInfo(tenantName)
                                .getAllowedClusters();
                        return allowedClusters.contains(clusterName);
                    } catch (PulsarAdminException e) {
                        throw new PulsarApiException(
                                "Could not fetch tenants allowed for cluster '%s'".formatted(clusterName), e
                        );
                    }
                })
                .toList();
    }

    private ClusterDto enrichWithCardDetails(ClusterDto clusterDto) {
        List<String> tenants = getTenantsAllowedForCluster(clusterDto.getName());
        long numberOfNamespaces = tenants.stream()
                .mapToLong(t -> namespaceService.getAllOfTenant(t).size())
                .sum();
        clusterDto.setNumberOfTenants(tenants.size());
        clusterDto.setNumberOfNamespaces(numberOfNamespaces);
        return clusterDto;
    }

}
