package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.service.ClusterService;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cluster")
public class ClusterController {

    private final ClusterService clusterService;

    @GetMapping()
    public ResponseEntity<List<ClusterDto>> getTopology() throws PulsarAdminException {
        return new ResponseEntity<>(clusterService.getAllClusters(), HttpStatus.OK);
    }

}
