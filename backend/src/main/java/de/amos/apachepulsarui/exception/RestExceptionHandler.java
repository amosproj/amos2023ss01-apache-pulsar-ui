/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.exception;

import de.amos.apachepulsarui.exception.BadRequestException.BadRequestExceptionClientInfo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(PulsarApiException.class)
    protected ResponseEntity<ExceptionClientInfo> handlePulsarApiException(PulsarApiException exception) {
        return ResponseEntity
                .status(exception.getHttpStatus())
                .body(exception.toClientInfo());
    }

    @ExceptionHandler({BadRequestException.class})
    protected ResponseEntity<BadRequestExceptionClientInfo> handleBadRequestException(BadRequestException exception) {
        return ResponseEntity
                .status(exception.getHttpStatus())
                .body(exception.toClientInfo());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<BadRequestExceptionClientInfo> handleMissingParameterException(MissingServletRequestParameterException exception) {
        return handleBadRequestException(new BadRequestException.MissingParameter(exception));
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ExceptionClientInfo> handleUnknownException(Exception exception) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ExceptionClientInfo("Unknown error", exception));
    }

}
