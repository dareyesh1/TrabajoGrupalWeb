package com.programacion.web.repository.impl;

import com.programacion.web.db.Album;
import com.programacion.web.db.Photo;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class PhotoRepository implements Repository<Photo> {

    private final DbClient dbClient;

    public PhotoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }



    @Override
    public List<Photo> findAll() {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM photos
                        ORDER BY id
                        """)
                .execute()
                .map(this::mapRowToPhoto)
                .toList();
    }

    @Override
    public Optional<Photo> findById(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM photos
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToPhoto)
                .findFirst();
    }

    @Override
    public Photo save(Photo photo) {

        dbClient.execute()
                .createInsert("""
                        INSERT INTO photos(
                            album_id,
                            title,
                            url,
                            thumbnail_url
                        )
                        VALUES(
                            :albumId,
                            :title,
                            :url,
                            :thumbnailUrl
                        )
                        """)
                .addParam("albumId", photo.getAlbum().getId())
                .addParam("title", photo.getTitle())
                .addParam("url", photo.getUrl())
                .addParam("thumbnailUrl", photo.getThumbnailUrl())
                .execute();

        return photo;
    }

    @Override
    public Photo update(Integer id, Photo photo) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Foto no encontrada"));

        dbClient.execute()
                .createUpdate("""
                        UPDATE photos
                        SET
                            album_id = :albumId,
                            title = :title,
                            url = :url,
                            thumbnail_url = :thumbnailUrl
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .addParam("albumId", photo.getAlbum().getId())
                .addParam("title", photo.getTitle())
                .addParam("url", photo.getUrl())
                .addParam("thumbnailUrl", photo.getThumbnailUrl())
                .execute();

        photo.setId(id);

        return photo;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Foto no encontrada"));

        dbClient.execute()
                .createDelete("""
                        DELETE FROM photos
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute();
    }

    public List<Photo> findByAlbumId(Integer albumId) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM photos
                        WHERE album_id = :albumId
                        ORDER BY id
                        """)
                .addParam("albumId", albumId)
                .execute()
                .map(this::mapRowToPhoto)
                .toList();
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

    private Photo mapRowToPhoto(DbRow row) {

        Album album = Album.builder()
                .id(getInteger(row, "album_id"))
                .build();

        return Photo.builder()
                .id(getInteger(row, "id"))
                .title(getString(row, "title"))
                .url(getString(row, "url"))
                .thumbnailUrl(getString(row, "thumbnail_url"))
                .album(album)
                .build();
    }

}