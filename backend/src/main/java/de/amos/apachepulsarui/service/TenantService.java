package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.controller.exception.PulsarApiException;
import de.amos.apachepulsarui.dto.TenantDto;
import de.amos.apachepulsarui.dto.TenantDetailsDto;
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

    public List<String> getAllNames() throws PulsarApiException {
        try {
            return pulsarAdmin.tenants().getTenants();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants.", e);
        }
    }

    @Cacheable("tenats.getAll")
    public List<TenantDto> getAllFiltered(List<String> tenants) throws PulsarApiException {
        try {
            List<String> tenantNames = pulsarAdmin.tenants().getTenants();

            if (tenants == null || tenants.isEmpty()) {
                return tenantNames.stream()
                        .map(name -> TenantDto.create(getTenantInfo(name), name))
                        .toList();
            }

            List<String> filteredNames = tenantNames.stream()
                    .filter(tenant -> tenants.stream().anyMatch(t -> t.equals(tenant)))
                    .toList();

            return filteredNames.stream()
                    .map(name -> TenantDto.create(getTenantInfo(name), name))
                    .toList();

        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants.", e);
        }
    }

    @Cacheable("tenant.detail")
    public TenantDetailsDto getTenantDetails(String tenantName) {
        List<String> namespacesOfTenant = namespaceService.getAllOfTenant(tenantName);
        return TenantDetailsDto.builder()
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
            throw new PulsarApiException("Could not fetch tenant info of tenant %s.".formatted(tenantName), e);
        }
    }

}
