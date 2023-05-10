package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.ClusterDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.ClusterData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClusterService {

    private final PulsarAdmin pulsarAdmin;

    public List<ClusterDto> getAllClusters() {
        try {
            return pulsarAdmin.clusters().getClusters().stream()
                    .map(ClusterDto::fromString)
                    .map(this::enrichWithClusterData)
                    .map(this::enrichWithBrokerData)
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not get list of all clusters. E: %s".formatted(e));
            return List.of();
        }
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

}
