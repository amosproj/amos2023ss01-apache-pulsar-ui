package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.NamespaceDto;
import de.amos.apachepulsarui.dto.TenantDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final PulsarAdmin pulsarAdmin;

    private final NamespaceService namespaceService;

    public List<TenantDto> getAllTenants() {
        try {
            return pulsarAdmin.tenants().getTenants().stream()
                    .map(TenantDto::fromString)
                    .map(this::enrichWithTenantInfo)
                    .map(this::enrichWithNamespaces)
                    .toList();
        } catch (PulsarAdminException e) {
            log.error("Could not get list of all tenants. E: %s".formatted(e));
            return List.of();
        }
    }

    private TenantDto enrichWithNamespaces(TenantDto tenant) {
        List<NamespaceDto> namespacesOfTenant = namespaceService.getAllOfTenant(tenant);
        tenant.setNamespaces(namespacesOfTenant);
        return tenant;
    }

    private TenantDto enrichWithTenantInfo(TenantDto tenant) {
        try {
			tenant.setTenantInfo(pulsarAdmin.tenants().getTenantInfo(tenant.getId()));
			return tenant;
        } catch (PulsarAdminException e) {
            log.error("Could not fetch tenant info of tenant %s. E: %s".formatted(tenant.getId(), e));
            return tenant;
        }
    }

}
