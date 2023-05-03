/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 */

package de.amos.apachepulsarui.service;

import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NamespaceService {

    private final PulsarAdmin pulsarAdmin;

    public List<String> getAllPublicNamespaces() {
        try {
            return pulsarAdmin.namespaces().getNamespaces("public");
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }
}
