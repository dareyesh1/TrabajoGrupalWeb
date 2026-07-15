package com.programacion.web;

import com.programacion.web.config.DbConfig;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.handler.UserHandler;
import com.programacion.web.repository.impl.UserRepository;
import com.programacion.web.services.impl.UserServiceImpl;
import io.helidon.config.Config;
import io.helidon.webserver.WebServer;

public class HelidonServerMain {

    public static void main(String[] args) {

        // Configuración
        Config config = Config.create();

        int port = config.get("server.port")
                .asInt()
                .orElse(8080);


        DbConfig dbConfig = new DbConfig(config);


        UserRepository userRepository =
                new UserRepository(dbConfig.getDbClient());


        UserServiceImpl userService =
                new UserServiceImpl(userRepository);


        GlobalExceptionHandler exceptionHandler =
                new GlobalExceptionHandler();

        UserHandler userHandler =
                new UserHandler(userService, exceptionHandler);

        WebServer server = WebServer.builder()
                .port(port)
                .routing(routing -> routing
                        .register("/api/users", userHandler)
                )
                .build();

        server.start();

        System.out.printf(
                "Servidor iniciado en http://localhost:%d%n",
                port
        );
    }
}