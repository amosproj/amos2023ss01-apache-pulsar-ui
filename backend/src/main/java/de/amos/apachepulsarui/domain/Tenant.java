package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class Tenant {

    String id;
    List<Namespace> namespaces;

}
