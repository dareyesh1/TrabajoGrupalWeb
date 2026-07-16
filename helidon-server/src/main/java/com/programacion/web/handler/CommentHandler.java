package com.programacion.web.handler;

import com.programacion.web.db.Comment;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.services.interf.Service;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class CommentHandler implements HttpService {

    private final Service<Comment> commentService;
    private final GlobalExceptionHandler globalExceptionHandler;

    public CommentHandler(Service<Comment> commentService,
                          GlobalExceptionHandler globalExceptionHandler) {

        this.commentService = commentService;
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
                response.send(commentService.findAll()));
    }

    private void findById(ServerRequest request,
                          ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(commentService.findById(id));
        });
    }

    private void save(ServerRequest request,
                      ServerResponse response) {

        execute(response, () -> {

            Comment comment = request.content().as(Comment.class);

            Comment saved = commentService.save(comment);

            response.status(Status.CREATED_201)
                    .send(saved);
        });
    }

    private void update(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            Comment comment = request.content().as(Comment.class);

            Comment updated = commentService.update(id, comment);

            response.send(updated);
        });
    }

    private void delete(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            commentService.delete(id);

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