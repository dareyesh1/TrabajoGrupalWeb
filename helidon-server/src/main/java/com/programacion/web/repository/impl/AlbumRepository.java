package com.programacion.web.repository.impl;

import com.programacion.web.db.Album;
import com.programacion.web.db.User;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class AlbumRepository implements Repository<Album> {

    private final DbClient dbClient;

    public AlbumRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    @Override
    public List<Album> findAll() {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM albums
                        ORDER BY id
                        """)
                .execute()
                .map(this::mapRowToAlbum)
                .toList();
    }

    @Override
    public Optional<Album> findById(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM albums
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToAlbum)
                .findFirst();
    }

    public List<Album> findByUserId(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM albums
                        WHERE user_id = :id
                        ORDER BY id
                        """)
                .addParam("id", id)
                .execute()

                .map(this::mapRowToAlbum)
                .toList();
    }

    @Override
    public Album save(Album album) {

        dbClient.execute()
                .createInsert("""
                        INSERT INTO albums(
                            user_id,
                            title
                        )
                        VALUES(
                            :userId,
                            :title
                        )
                        """)
                .addParam("userId", album.getUser().getId())
                .addParam("title", album.getTitle())
                .execute();

        return album;
    }

    @Override
    public Album update(Integer id, Album album) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Álbum no encontrado"));

        dbClient.execute()
                .createUpdate("""
                        UPDATE albums
                        SET
                            user_id = :userId,
                            title = :title
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .addParam("userId", album.getUser().getId())
                .addParam("title", album.getTitle())
                .execute();

        album.setId(id);

        return album;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Álbum no encontrado"));

        dbClient.execute()
                .createDelete("""
                        DELETE FROM albums
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute();
    }

    private Integer getInteger(DbRow row, String column) {

        return row.column(column)
                .as(Integer.class)
                .orElse(null);
    }

    private String getString(DbRow row, String column) {

        return row.column(column)
                .as(String.class)
                .orElse(null);
    }

    private Album mapRowToAlbum(DbRow row) {

        User user = User.builder()
                .id(getInteger(row, "user_id"))
                .build();

        return Album.builder()
                .id(getInteger(row, "id"))
                .title(getString(row, "title"))
                .user(user)
                .build();
    }

}