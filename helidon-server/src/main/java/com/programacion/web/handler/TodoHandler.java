package com.programacion.web.handler;

import com.programacion.web.db.Todo;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.services.interf.Service;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class TodoHandler implements HttpService {

    private final Service<Todo> todoService;
    private final GlobalExceptionHandler globalExceptionHandler;

    public TodoHandler(Service<Todo> todoService,
                       GlobalExceptionHandler globalExceptionHandler) {

        this.todoService = todoService;
        this.globalExceptionHandler = globalExceptionHandler;
    }

    @Override
    public void routing(HttpRules rules) {

        rules.get("/", this::findAll);
        rules.get("/{id}", this::findById);
        rules.post("/", this::save);
        rules.put("/{id}", this::update);
        rules.delete("/{id}", this::delete);
    }

    private void findAll(ServerRequest request,
                         ServerResponse response) {

        execute(response, () ->
                response.send(todoService.findAll()));
    }

    private void findById(ServerRequest request,
                          ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(todoService.findById(id));
        });
    }

    private void save(ServerRequest request,
                      ServerResponse response) {

        execute(response, () -> {

            Todo todo = request.content().as(Todo.class);

            Todo saved = todoService.save(todo);

            response.status(Status.CREATED_201)
                    .send(saved);
        });
    }

    private void update(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            Todo todo = request.content().as(Todo.class);

            Todo updated = todoService.update(id, todo);

            response.send(updated);
        });
    }

    private void delete(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            todoService.delete(id);

            response.status(Status.NO_CONTENT_204)
                    .send();
        });
    }

    private Integer getId(ServerRequest request) {

        return Integer.valueOf(
                request.path()
                        .pathParameters()
                        .get("id"));
    }

    private void execute(ServerResponse response,
                         Runnable action) {

        try {
            action.run();
        } catch (Exception e) {
            globalExceptionHandler.handle(e, response);
        }
    }

}