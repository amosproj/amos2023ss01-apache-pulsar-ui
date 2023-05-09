package de.amos.apachepulsarui.domain;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder(toBuilder = true)
public class Namespace {

    String id;
    List<Topic> topics;

}
