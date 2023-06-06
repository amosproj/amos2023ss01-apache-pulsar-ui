/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.controller.exception;

import lombok.Getter;
import org.apache.pulsar.client.admin.PulsarAdminException;
import org.apache.pulsar.client.api.PulsarClientException;
import org.springframework.http.HttpStatus;

@Getter
public class PulsarApiException extends RuntimeException {

    private final String message;

    private final Exception cause;

    /**
     * The http status code which will be returned to the client.
     * Defaults to 500 internal server error.
     */
    private HttpStatus httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    public PulsarApiException(String message, PulsarAdminException cause) {
        super(message);
        this.message = message;
        this.httpStatus = HttpStatus.valueOf(cause.getStatusCode());
        this.cause = cause;
    }

    public PulsarApiException(String message, PulsarClientException cause) {
        super(message);
        this.message = message;
        this.cause = cause;
    }

    public PulsarApiException(String message, HttpStatus status, PulsarClientException cause) {
        super(message);
        this.message = message;
        this.httpStatus = status;
        this.cause = cause;
    }

    /**
     * Meant to be used for serialization.
     */
    public ExceptionClientInfo toClientInfo() {
        return new ExceptionClientInfo(this.message, this.cause);
    }

    @Getter
    private static class ExceptionClientInfo {

        private final String message;
        private final Class<?> type;

        public ExceptionClientInfo(String message, Exception cause) {
            this.message = message + ": " + cause.getMessage();
            this.type = cause.getClass();
        }
        
    }

}
