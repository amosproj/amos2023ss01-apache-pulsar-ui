package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.ClusterDto;
import de.amos.apachepulsarui.service.ClusterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cluster")
public class ClusterController {

    private final ClusterService clusterService;

    @GetMapping()
    public ResponseEntity<ClusterDto> getClusterDetails(@RequestParam String clusterName) {
        return new ResponseEntity<>(clusterService.getClusterDetails(clusterName), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<String >> getAll() {
        return new ResponseEntity<>(clusterService.getAllClusterNames(), HttpStatus.OK);
    }

}
