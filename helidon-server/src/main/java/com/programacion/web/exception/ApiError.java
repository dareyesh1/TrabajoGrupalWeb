package com.programacion.web.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiError {

    private int status;
    private String error;
    private String message;
    private String timestamp;

}