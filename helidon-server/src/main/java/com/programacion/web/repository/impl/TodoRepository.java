package com.programacion.web.repository.impl;

import com.programacion.web.db.Todo;
import com.programacion.web.db.User;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class TodoRepository implements Repository<Todo> {

    private final DbClient dbClient;

    public TodoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    @Override
    public List<Todo> findAll() {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM todos
                        ORDER BY id
                        """)
                .execute()
                .map(this::mapRowToTodo)
                .toList();
    }

    @Override
    public Optional<Todo> findById(Integer id) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM todos
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToTodo)
                .findFirst();
    }



    @Override
    public Todo save(Todo todo) {

        dbClient.execute()
                .createInsert("""
                        INSERT INTO todos(
                            user_id,
                            title,
                            completed
                        )
                        VALUES(
                            :userId,
                            :title,
                            :completed
                        )
                        """)
                .addParam("userId", todo.getUser().getId())
                .addParam("title", todo.getTitle())
                .addParam("completed", todo.getCompleted())
                .execute();

        return todo;
    }

    @Override
    public Todo update(Integer id, Todo todo) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Tarea no encontrada"));

        dbClient.execute()
                .createUpdate("""
                        UPDATE todos
                        SET
                            user_id = :userId,
                            title = :title,
                            completed = :completed
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .addParam("userId", todo.getUser().getId())
                .addParam("title", todo.getTitle())
                .addParam("completed", todo.getCompleted())
                .execute();

        todo.setId(id);

        return todo;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Tarea no encontrada"));

        dbClient.execute()
                .createDelete("""
                        DELETE FROM todos
                        WHERE id = :id
                        """)
                .addParam("id", id)
                .execute();
    }

    public List<Todo> findByUserId(Integer userId) {

        return dbClient.execute()
                .createQuery("""
                        SELECT *
                        FROM todos
                        WHERE user_id = :userId
                        ORDER BY id
                        """)
                .addParam("userId", userId)
                .execute()
                .map(this::mapRowToTodo)
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

    private Boolean getBoolean(DbRow row, String column) {

        return row.column(column)
                .as(Boolean.class)
                .orElse(null);
    }

    private Todo mapRowToTodo(DbRow row) {

        User user = User.builder()
                .id(getInteger(row, "user_id"))
                .build();

        return Todo.builder()
                .id(getInteger(row, "id"))
                .title(getString(row, "title"))
                .completed(getBoolean(row, "completed"))
                .user(user)
                .build();
    }

}