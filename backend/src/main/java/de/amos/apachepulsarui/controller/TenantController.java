/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 *
 */

package de.amos.apachepulsarui.controller;

import de.amos.apachepulsarui.dto.TenantDetailDto;
import de.amos.apachepulsarui.dto.TenantsDto;
import de.amos.apachepulsarui.service.TenantService;
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
@RequestMapping("/tenant")
public class TenantController {

    private final TenantService tenantService;

    @GetMapping()
    public ResponseEntity<TenantDetailDto> getTenantDetails(@RequestParam String tenantName) {
        return new ResponseEntity<>(tenantService.getTenantDetails(tenantName), HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<TenantsDto> getAllFiltered(@RequestParam (required = false, defaultValue = "") List<String> tenants) {
        return new ResponseEntity<>(new TenantsDto(tenantService.getAllFiltered(tenants)), HttpStatus.OK);
    }

}
