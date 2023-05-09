package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.domain.Cluster;
import de.amos.apachepulsarui.service.TopologyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/topology")
public class TopologyController {

    private final TopologyService topologyService;

    @GetMapping()
    public ResponseEntity<List<Cluster>> getTopology() {
        return new ResponseEntity<>(topologyService.getTopicLevelTopology(), HttpStatus.OK);
    }

}
