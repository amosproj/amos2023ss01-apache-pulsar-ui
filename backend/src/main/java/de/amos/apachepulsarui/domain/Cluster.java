package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder(toBuilder = true)
public class Cluster {

    private String id;
    private List<Tenant> tenants;

    public Cluster withTenants(List<Tenant> tenants) {
        return this.toBuilder()
                .tenants(tenants)
                .build();
    }

}
