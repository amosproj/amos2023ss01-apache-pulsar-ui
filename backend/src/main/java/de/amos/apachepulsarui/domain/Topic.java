package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class Topic {

    String topic;
    String localName;
    String namespace;
    String tenant;
    boolean isPersistent;

}
