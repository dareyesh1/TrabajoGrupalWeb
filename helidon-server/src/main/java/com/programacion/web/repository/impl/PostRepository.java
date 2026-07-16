package com.programacion.web.repository.impl;

import com.programacion.web.db.Comment;
import com.programacion.web.db.Post;
import com.programacion.web.db.User;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class PostRepository implements Repository<Post> {

    private final DbClient dbClient;

    public PostRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    @Override
    public List<Post> findAll() {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM posts
                        ORDER BY id
                        """)
                .execute()
                .map(this::mapRowToPost)
                .toList();
    }

    @Override
    public Optional<Post> findById(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM posts
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToPost)
                .findFirst();
    }

    @Override
    public Post save(Post post) {

        dbClient.execute()
                .createInsert("""
                        INSERT INTO posts(
                            user_id,
                            title,
                            body
                        )
                        VALUES(
                            :userId,
                            :title,
                            :body
                        )
                        """)
                .addParam("userId", post.getUser().getId())
                .addParam("title", post.getTitle())
                .addParam("body", post.getBody())
                .execute();

        return post;
    }

    @Override
    public Post update(Integer id, Post post) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Post no encontrado"));

        dbClient.execute()
                .createUpdate("""
                        UPDATE posts
                        SET
                            user_id = :userId,
                            title = :title,
                            body = :body
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .addParam("userId", post.getUser().getId())
                .addParam("title", post.getTitle())
                .addParam("body", post.getBody())
                .execute();

        post.setId(id);

        return post;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Post no encontrado"));

        dbClient.execute()
                .createDelete("""
                        DELETE FROM posts
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute();
    }

    public List<Post> findByUserId(Integer userId) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM posts
                        WHERE user_id = :userId
                        ORDER BY id
                        """)
                .addParam("userId", userId)
                .execute()
                .map(this::mapRowToPost)
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

    private Post mapRowToPost(DbRow row) {

        User user = User.builder()
                .id(getInteger(row, "user_id"))
                .build();

        return Post.builder()
                .id(getInteger(row, "id"))
                .title(getString(row, "title"))
                .body(getString(row, "body"))
                .user(user)
                .comments(List.of())
                .build();
    }

}
