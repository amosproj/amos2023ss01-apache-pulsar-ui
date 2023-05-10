package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Cluster;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ClusterService {

    private final PulsarAdmin pulsarAdmin;

    public List<Cluster> getAllClusters() {
        try {
            return pulsarAdmin.clusters().getClusters().stream()
                    .map(cluster -> Cluster.builder()
                            .id(cluster)
                            .build())
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not get list of all clusters. E: %s".formatted(e));
            return List.of();
        }
    }

}