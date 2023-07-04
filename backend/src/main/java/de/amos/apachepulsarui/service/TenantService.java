package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.dto.TenantDetailDto;
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
    private final TopicService topicService;

    @Cacheable("tenants.allNames")
    public List<String> getAllNames() throws PulsarApiException {
        try {
            return pulsarAdmin.tenants().getTenants();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants", e);
        }
    }

    @Cacheable("tenants.allFiltered")
    public List<TenantDto> getAllFiltered(List<String> tenants) throws PulsarApiException {
        try {
            List<String> tenantNames = pulsarAdmin.tenants().getTenants();
            if (tenants.isEmpty()) {
                return tenantNames.stream()
                        .map(name -> TenantDto.create(getTenantInfo(name), name))
                        .map(this::enrichWithCardDetails)
                        .toList();
            }

            return tenantNames.stream()
                    .filter(tenants::contains)
                    .map(name -> TenantDto.create(getTenantInfo(name), name))
                    .map(this::enrichWithCardDetails)
                    .toList();

        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants.", e);
        }
    }

    @Cacheable("tenant.detail")
    public TenantDetailDto getTenantDetails(String tenantName) {
        List<String> namespacesOfTenant = namespaceService.getAllOfTenant(tenantName);
        return TenantDetailDto.builder()
                .name(tenantName)
                .tenantInfo(getTenantInfo(tenantName))
                .namespaces(namespacesOfTenant)
                .build();
    }


    private TenantInfo getTenantInfo(String tenantName) {
        try {
            return pulsarAdmin.tenants().getTenantInfo(tenantName);
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not fetch tenant info of tenant '%s'".formatted(tenantName), e);
        }
    }


    private TenantDto enrichWithCardDetails(TenantDto tenantDto) {
        try {
            List<String> namespaces = pulsarAdmin.namespaces().getNamespaces(tenantDto.getName());
            long numberOfTopics = namespaces.stream().mapToLong(n -> topicService.getAllByNamespace(n).size()).sum();
            tenantDto.setNumberOfTopics(numberOfTopics);
            tenantDto.setNumberOfNamespaces(namespaces.size());
            return tenantDto;
        } catch (PulsarAdminException e) {
            throw new PulsarApiException(
                    "Could not fetch tenant data of tenant '%s'".formatted(tenantDto.getName()), e
            );
        }
    }
}
