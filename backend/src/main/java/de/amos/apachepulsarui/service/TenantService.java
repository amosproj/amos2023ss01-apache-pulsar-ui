package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Tenant;
import lombok.RequiredArgsConstructor;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Scope("singleton")
@RequiredArgsConstructor
public class TenantService {

    private final PulsarAdmin pulsarAdmin;

    public List<Tenant> getAllTenants() {
        try {
            return pulsarAdmin.tenants().getTenants().stream()
                    .map(tenant -> Tenant.builder()
                            .id(tenant)
                            .build())
                    .toList();
        } catch (PulsarAdminException e) {
            throw new RuntimeException(e);
        }
    }

}
