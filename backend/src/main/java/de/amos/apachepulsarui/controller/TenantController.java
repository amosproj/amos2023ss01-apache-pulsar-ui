/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.dto.TenantsDto;
import de.amos.apachepulsarui.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tenant")
public class TenantController {

    private final TenantService tenantService;

    @GetMapping
    public ResponseEntity<TenantsDto> getAllTenants() {
        List<TenantDto> tenantDtos = tenantService.getAllTenants();
        return new ResponseEntity<>(new TenantsDto(tenantDtos), HttpStatus.OK);
    }
}
