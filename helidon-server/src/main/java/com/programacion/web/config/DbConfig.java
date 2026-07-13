package com.programacion.web.config;

import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;

public class DbConfig {

    private final DbClient dbClient;

    public DbConfig(Config config) {

        this.dbClient = DbClient.builder()
                .config(config.get("db"))
                .build();
    }

    public DbClient getDbClient() {
        return dbClient;
    }

}
