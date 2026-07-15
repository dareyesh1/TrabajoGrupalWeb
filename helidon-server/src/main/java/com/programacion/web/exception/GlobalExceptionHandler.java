package com.programacion.web.exception;

import io.helidon.http.Status;
import io.helidon.webserver.http.ServerResponse;

import java.time.LocalDateTime;

public final class GlobalExceptionHandler {

    public GlobalExceptionHandler() {
    }

    public void handle(Exception exception,
                              ServerResponse response) {

        ApiError error;

        if (exception instanceof ResourceNotFoundException e) {

            error = ApiError.builder()
                    .status(404)
                    .error("Not Found")
                    .message(e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            response.status(Status.NOT_FOUND_404)
                    .send(error);

            return;
        }

        if (exception instanceof BadRequestException e) {

            error = ApiError.builder()
                    .status(400)
                    .error("Bad Request")
                    .message(e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            response.status(Status.BAD_REQUEST_400)
                    .send(error);

            return;
        }

        if (exception instanceof ConflictException e) {

            error = ApiError.builder()
                    .status(409)
                    .error("Conflict")
                    .message(e.getMessage())
                    .timestamp(LocalDateTime.now().toString())
                    .build();

            response.status(Status.CONFLICT_409)
                    .send(error);

            return;
        }

        error = ApiError.builder()
                .status(500)
                .error("Internal Server Error")
                .message(exception.getMessage())
                .timestamp(LocalDateTime.now().toString())
                .build();

        response.status(Status.INTERNAL_SERVER_ERROR_500)
                .send(error);
    }

}