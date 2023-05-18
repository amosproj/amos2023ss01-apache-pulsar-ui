/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.controller.exception;

import org.apache.pulsar.client.admin.PulsarAdminException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class PulsarExceptionHandler extends ResponseEntityExceptionHandler {

    // TODO: just a first draft, may we add custom exceptions, and use them every time a PulsarAdmin/PulsarClientException
    //  occurs and enrich the errors with meta information.
    @ExceptionHandler(value = {PulsarAdminException.class})
    protected ResponseEntity<Object> handleConflict(PulsarAdminException exception, WebRequest request) {
        return handleExceptionInternal(
                exception,
                exception.getMessage(),
                new HttpHeaders(),
                HttpStatus.INTERNAL_SERVER_ERROR,
                request
        );
    }

}
