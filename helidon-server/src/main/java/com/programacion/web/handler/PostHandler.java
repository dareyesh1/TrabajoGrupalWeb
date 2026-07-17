package com.programacion.web.handler;

import com.programacion.web.db.Post;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.services.impl.CommentServiceImpl;
import com.programacion.web.services.interf.Service;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class PostHandler implements HttpService {

    private final Service<Post> postService;
    private final CommentServiceImpl commentService;
    private final GlobalExceptionHandler globalExceptionHandler;

    public PostHandler(CommentServiceImpl commentService,Service<Post> postService,
                       GlobalExceptionHandler globalExceptionHandler) {

        this.postService = postService;
        this.globalExceptionHandler = globalExceptionHandler;
        this.commentService = commentService;
    }

    @Override
    public void routing(HttpRules rules) {

        rules.get("/", this::findAll);
        rules.get("/{id}", this::findById);
        rules.get("/{id}/comments", this::findCommentsByPostId);
        rules.post("/", this::save);

        rules.put("/{id}", this::update);
        rules.delete("/{id}", this::delete);
    }

    private void findCommentsByPostId(ServerRequest serverRequest, ServerResponse serverResponse) {

        execute(serverResponse, () -> {

            Integer id = getId(serverRequest);

            serverResponse.send(commentService.findByPostId(id));
        });

    }

    private void findAll(ServerRequest request,
                         ServerResponse response) {

        execute(response, () ->
                response.send(postService.findAll()));
    }

    private void findById(ServerRequest request,
                          ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(postService.findById(id));
        });
    }

    private void save(ServerRequest request,
                      ServerResponse response) {

        try {
            execute(response, () -> {

                Post post = request.content().as(Post.class);

                Post saved = postService.save(post);

                response.status(Status.CREATED_201)
                        .send(saved);
            });
        } catch (Exception e) {
            e.printStackTrace();

            response.status(500).send("{\"error\": \"Error en BD: " + e.getMessage() + "\"}");
        }
    }

    private void update(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            Post post = request.content().as(Post.class);

            Post updated = postService.update(id, post);

            response.send(updated);
        });
    }

    private void delete(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            postService.delete(id);

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