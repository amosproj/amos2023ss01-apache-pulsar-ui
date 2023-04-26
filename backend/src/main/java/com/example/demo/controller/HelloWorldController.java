package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;

@Controller
public class HelloWorldController {

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.of(Optional.of("Hello"));
    }

    @GetMapping("/hello/{name}")
    public ResponseEntity<String> helloName(@PathVariable String name) {
        return ResponseEntity.of(Optional.of("Hello " + name));
    }
}
