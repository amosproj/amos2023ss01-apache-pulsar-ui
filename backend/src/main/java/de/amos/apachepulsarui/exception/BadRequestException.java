/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MissingServletRequestParameterException;

@Getter
public class BadRequestException extends RuntimeException {

    private final String message;
    private final String hint;
    private final HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

    public BadRequestException(String message, String hint) {
        this.message = message;
        this.hint = hint;
    }

    public static class MissingParameter extends BadRequestException {
        public MissingParameter(MissingServletRequestParameterException exception) {
            super(exception.getMessage(), "Check Swagger-API documentation for correct usage.");
        }
    }

    public static class InvalidTopicName extends BadRequestException{
        public InvalidTopicName() {
            super(
                    "Topic name invalid.",
                    "Valid topic must have schema: {persistent|non-persistent}://tenant/namespace/topic"
            );
        }
    }

    public BadRequestExceptionClientInfo toClientInfo() {
        return new BadRequestExceptionClientInfo(message, hint);
    }

    @Getter
    @AllArgsConstructor
    public static class BadRequestExceptionClientInfo {

        private final String message;
        private final String hint;

    }

}
