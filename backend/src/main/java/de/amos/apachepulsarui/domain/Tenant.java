package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder(toBuilder = true)
public class Tenant {

    String id;
    List<Namespace> namespaces;

}
