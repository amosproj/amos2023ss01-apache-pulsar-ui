package com.example.demo.factory;

import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.api.PulsarClientException;

public class PulsarAdminFactory {

    public static PulsarAdmin create(String connectionUrl) throws PulsarClientException {
        boolean tlsAllowInsecureConnection = false;
        String tlsTrustCertsFilePath = null;
        return PulsarAdmin.builder()
                .serviceHttpUrl(connectionUrl)
                .tlsTrustCertsFilePath(tlsTrustCertsFilePath)
                .allowTlsInsecureConnection(tlsAllowInsecureConnection)
                .build();
    }

}
