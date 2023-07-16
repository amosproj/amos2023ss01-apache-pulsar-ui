/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Niklas Teschner <niklas.teschner@web.de>
 * SPDX-FileCopyrightText: 2023 Anna Haverkamp <anna.lucia.haverkamp@gmail.com>
 */

package de.amos.apachepulsarui.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.avro.Schema;
import org.apache.avro.generic.GenericDatumReader;
import org.apache.avro.generic.GenericDatumWriter;
import org.apache.avro.io.DecoderFactory;
import org.apache.avro.io.EncoderFactory;
import org.apache.commons.lang3.StringUtils;
import org.apache.pulsar.client.api.Message;
import org.apache.pulsar.common.naming.TopicName;

import javax.validation.constraints.NotEmpty;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class MessageDto {

    String messageId;
    @NotEmpty
    String topic;
    @NotEmpty
    String payload;
    String schema;
    String namespace;
    String tenant;
    Long publishTime;
    String producer;

    /**
     * Static factory for messages already existing in Pulsar.
     */
    public static MessageDto fromExistingMessage(Message<byte[]> message, String schemaDefinition) {
        MessageDto messageDto = new MessageDto();
        String topicName = message.getTopicName();
        messageDto.messageId = message.getMessageId().toString();
        messageDto.topic = topicName;
        messageDto.payload = tryParsePayloadWithAvroSchema(message, schemaDefinition);
        messageDto.schema = schemaDefinition;
        messageDto.namespace = TopicName.get(topicName).getNamespacePortion();
        messageDto.tenant = TopicName.get(topicName).getTenant();
        messageDto.publishTime = message.getPublishTime();
        messageDto.producer = message.getProducerName();

        return messageDto;
    }

    private static String tryParsePayloadWithAvroSchema(Message<byte[]> message, String schemaDefinition) {
        if (!StringUtils.isEmpty(schemaDefinition)) {
            // Avro byte-to-json conversion inspired from https://stackoverflow.com/a/58390574
            var schema = new Schema.Parser().parse(schemaDefinition);

            try (var outputStream = new ByteArrayOutputStream()){
                var reader = new GenericDatumReader<>(schema);
                var decoder = DecoderFactory.get().binaryDecoder(message.getData(), null);
                var record = reader.read(null, decoder);


                var writer = new GenericDatumWriter<>(schema);
                var encoder = EncoderFactory.get().jsonEncoder(schema, outputStream, true);
                writer.write(record, encoder);
                encoder.flush();
                outputStream.flush();
                return outputStream.toString(StandardCharsets.UTF_8);
            } catch (Exception e) {
                // Do nothing. If message cannot be parsed with Avro schema, return UTF-8 string below
            }
        }

        return new String(message.getData(), StandardCharsets.UTF_8);
    }


    /**
     * Static factory for messages meant to be sent to Pulsar.
     * They won't have a messageId (and further information yet).
     */
    public static MessageDto create(String topic, String payload) {
        MessageDto messageDto = new MessageDto();
        messageDto.topic = topic;
        messageDto.payload = payload;
        return messageDto;
    }

}
