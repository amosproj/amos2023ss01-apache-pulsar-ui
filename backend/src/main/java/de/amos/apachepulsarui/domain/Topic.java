package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder(toBuilder = true)
public class Topic {

    String name;

    String localName;

    String namespace;

    String tenant;

    boolean isPersistent;

    @Builder.Default
    List<String> subscriptions = List.of();

}
