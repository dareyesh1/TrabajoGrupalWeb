package com.programacion.web;

import com.programacion.web.config.DbConfig;
import io.helidon.config.Config;

public class HelidonServerMain {

    public static void main(String[] args) {

        Config config = Config.create();

        DbConfig dbConfig = new DbConfig(config);

        System.out.println("DbClient inicializado correctamente.");

    }

}