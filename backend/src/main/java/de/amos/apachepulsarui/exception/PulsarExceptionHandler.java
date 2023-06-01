/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.controller.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class PulsarExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {PulsarApiException.class})
    protected ResponseEntity<Object> handleConflict(PulsarApiException exception, WebRequest request) {
        return handleExceptionInternal(
                exception,
                exception.toClientInfo(),
                new HttpHeaders(),
                exception.getHttpStatus(),
                request
        );
    }

}
