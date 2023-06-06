package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.controller.exception.PulsarApiException;
import de.amos.apachepulsarui.dto.ClusterDto;
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

    @Cacheable("cluster.all")
    public List<String> getAllNames() {
        try {
            return pulsarAdmin.clusters().getClusters();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch list a list of all clusters.", e);
        }
    }

    @Cacheable("cluster.detail")
    public ClusterDto getClusterDetails(String clusterName) {

        ClusterData clusterData = getClusterData(clusterName);
        List<String> activeBrokers = getActiveBrokers(clusterName);
        List<String> tenantsAllowedForCluster = getTenantsAllowedForCluster(clusterName);

        return ClusterDto.builder()
                .name(clusterName)
                .serviceUrl(clusterData.getServiceUrl())
                .brokerServiceUrl(clusterData.getBrokerServiceUrl())
                .brokers(activeBrokers)
                .amountOfBrokers(activeBrokers.size())
                .tenants(tenantsAllowedForCluster)
                .amountOfTenants(tenantsAllowedForCluster.size())
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
                                "Could not fetch tenants allowed for cluster %s.".formatted(clusterName), e
                        );
                    }
                })
                .toList();
    }

}
