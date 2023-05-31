package de.amos.apachepulsarui.service;

import de.amos.apachepulsarui.controller.exception.PulsarApiException;
import de.amos.apachepulsarui.dto.TenantDto;
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
    private final NamespaceService namespaceService;

    public List<String> getAllNames() {
        try {
            return pulsarAdmin.tenants().getTenants();
        } catch (PulsarAdminException e) {
            throw new PulsarApiException("Could not get a list of all tenants.", e);
        }
    }

    public TenantDto getTenantDetails(String tenantName) {

        // TODO: add namespaces when refactoring is done

        return TenantDto.builder()
                .tenantInfo(getTenantInfo(tenantName))
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
