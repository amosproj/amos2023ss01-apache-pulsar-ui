package de.amos.apachepulsarui.parser;

import de.amos.apachepulsarui.domain.Topic;
import org.apache.pulsar.common.naming.TopicName;

public class TopicParser {

    /**
     * Converts a valid complete topic name (like "persistent://eu-tenant/hr/fizzbuzz" into a {@link Topic}.
     */
    public static Topic fromString(String completeTopicName) {
        TopicName topicName = TopicName.get(completeTopicName);
        return Topic.builder()
                .name(topicName.toString())
                .localName(topicName.getLocalName())
                .namespace(topicName.getNamespacePortion())
                .tenant(topicName.getTenant())
                .isPersistent(topicName.isPersistent())
                .build();
    }

}
