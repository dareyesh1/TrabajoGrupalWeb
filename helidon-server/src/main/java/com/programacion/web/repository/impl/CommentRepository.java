package com.programacion.web.repository.impl;

import com.programacion.web.db.Comment;
import com.programacion.web.db.Post;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class CommentRepository implements Repository<Comment> {

    private final DbClient dbClient;

    public CommentRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    @Override
    public List<Comment> findAll() {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM comments
                        ORDER BY id
                        """)
                .execute()
                .map(this::mapRowToComment)
                .toList();
    }

    @Override
    public Optional<Comment> findById(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM comments
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToComment)
                .findFirst();
    }

    @Override
    public Comment save(Comment comment) {

        dbClient.execute()
                .createInsert("""
                        INSERT INTO comments(
                            post_id,
                            name,
                            email,
                            body
                        )
                        VALUES(
                            :postId,
                            :name,
                            :email,
                            :body
                        )
                        """)
                .addParam("postId", comment.getPost().getId())
                .addParam("name", comment.getName())
                .addParam("email", comment.getEmail())
                .addParam("body", comment.getBody())
                .execute();

        return comment;
    }

    @Override
    public Comment update(Integer id, Comment comment) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Comentario no encontrado"));

        dbClient.execute()
                .createUpdate("""
                        UPDATE comments
                        SET
                            post_id = :postId,
                            name = :name,
                            email = :email,
                            body = :body
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .addParam("postId", comment.getPost().getId())
                .addParam("name", comment.getName())
                .addParam("email", comment.getEmail())
                .addParam("body", comment.getBody())
                .execute();

        comment.setId(id);

        return comment;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Comentario no encontrado"));

        dbClient.execute()
                .createDelete("""
                        DELETE FROM comments
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute();
    }

    public List<Comment> findByPostId(Integer postId) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM comments
                        WHERE post_id = :postId
                        ORDER BY id
                        """)
                .addParam("postId", postId)
                .execute()
                .map(this::mapRowToComment)
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

    private Comment mapRowToComment(DbRow row) {

        Post post = Post.builder()
                .id(getInteger(row, "post_id"))
                .build();

        return Comment.builder()
                .id(getInteger(row, "id"))
                .name(getString(row, "name"))
                .email(getString(row, "email"))
                .body(getString(row, "body"))
                .post(post)
                .build();
    }

}