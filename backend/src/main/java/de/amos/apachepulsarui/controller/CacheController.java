package de.amos.apachepulsarui.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
@RequestMapping("/cache")
@RequiredArgsConstructor
public class CacheController {

    private final CacheManager cacheManager;

    @GetMapping("/flush")
    public ResponseEntity<Void> flush() {
        cacheManager.getCacheNames()
                .forEach(cache -> Objects.requireNonNull(cacheManager.getCache(cache)).clear());
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
