/*
 * SPDX-License-Identifier: MIT
 * SPDX-FileCopyrightText: 2023 Jonas Arnhold <jonasarnhold@web.de>
 */

package de.amos.apachepulsarui.exception;

import lombok.Getter;

@Getter
public class ExceptionClientInfo {

    private final String shortMessage;
    private final String message;
    private final Class<?> type;

    public ExceptionClientInfo(String message, Exception cause) {
        this.shortMessage = message;
        this.message = message + ": " + cause.getMessage();
        this.type = cause.getClass();
    }

}
