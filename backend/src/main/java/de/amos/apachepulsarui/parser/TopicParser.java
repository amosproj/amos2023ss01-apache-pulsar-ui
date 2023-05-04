package de.amos.apachepulsarui.parser;

import de.amos.apachepulsarui.domain.Topic;
import org.apache.pulsar.common.naming.TopicName;

public class TopicParser {

    public static Topic fromString(String topic) {
        TopicName topicName = TopicName.get(topic);
        return Topic.builder()
                .localName(topicName.getLocalName())
                .namespace(topicName.getNamespace())
                .tenant(topicName.getTenant())
                .isPersistent(topicName.isPersistent())
                .build();
    }

}
