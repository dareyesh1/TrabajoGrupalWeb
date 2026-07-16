package com.programacion.web.exception.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiErrorDto {

    private int status;
    private String error;
    private String message;
    private String timestamp;

}