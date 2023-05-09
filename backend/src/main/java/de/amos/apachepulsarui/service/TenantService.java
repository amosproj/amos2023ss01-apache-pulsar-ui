package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.domain.Tenant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final PulsarAdmin pulsarAdmin;

    public List<Tenant> getAllTenants() {
        try {
            return pulsarAdmin.tenants().getTenants().stream()
                    .map(tenant -> Tenant.builder()
                            .id(tenant)
                            .build())
                    .map(this::enrichWithTenantInfo)
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not get list of all tenants. E: %s".formatted(e));
            return List.of();
        }
    }

    private Tenant enrichWithTenantInfo(Tenant tenant) {
        try {
            TenantInfo info = pulsarAdmin.tenants().getTenantInfo(tenant.getId());
            return tenant.toBuilder()
                    .tenantInfo(info)
                    .build();
        } catch (PulsarAdminException e) {
            log.error("Could not fetch tenant info of tenant %s. E: %s".formatted(tenant.getId(), e));
            return tenant;
        }
    }

}
