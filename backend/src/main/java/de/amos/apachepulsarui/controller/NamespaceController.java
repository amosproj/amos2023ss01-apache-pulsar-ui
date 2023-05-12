/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.NamespacesDto;
import de.amos.apachepulsarui.service.NamespaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/namespace")
public class NamespaceController {

    private final NamespaceService namespaceService;

    @GetMapping
    public ResponseEntity<NamespacesDto> getAllNamespaces() {
        List<NamespaceDto> namespaceDtos = namespaceService.getAll();
        return new ResponseEntity<>(new NamespacesDto(namespaceDtos), HttpStatus.OK);
    }

}
