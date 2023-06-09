package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.exception.PulsarApiException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pulsar.client.admin.PulsarAdmin;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.common.policies.data.TenantInfo;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final PulsarAdmin pulsarAdmin;
    private final NamespaceService namespaceService;

    @Cacheable("tenant.all")
    public List<String> getAllNames() throws PulsarApiException {
        try {
            return pulsarAdmin.tenants().getTenants();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants", e);
        }
    }

    @Cacheable("tenant.detail")
    public TenantDto getTenantDetails(String tenantName) {
        List<String> namespacesOfTenant = namespaceService.getAllOfTenant(tenantName);
        return TenantDto.builder()
                .name(tenantName)
                .tenantInfo(getTenantInfo(tenantName))
                .namespaces(namespacesOfTenant)
                .amountOfNamespaces(namespacesOfTenant.size())
                .build();
    }

    private TenantInfo getTenantInfo(String tenantName) {
        try {
			return pulsarAdmin.tenants().getTenantInfo(tenantName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch tenant info of tenant '%s'".formatted(tenantName), e);
        }
    }

}
