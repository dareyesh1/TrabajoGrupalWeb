package com.programacion.web.handler;

import com.programacion.web.db.Post;
import com.programacion.web.db.User;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.services.impl.AlbumServiceImpl;
import com.programacion.web.services.impl.PostServiceImpl;
import com.programacion.web.services.impl.TodoServiceImpl;
import com.programacion.web.services.impl.UserServiceImpl;
import com.programacion.web.services.interf.Service;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class UserHandler implements HttpService {
    private final PostServiceImpl postService;
    private final AlbumServiceImpl albumService;
    private final TodoServiceImpl todoService;
    private final Service<User> userService;
    private final GlobalExceptionHandler globalExceptionHandler;

    public UserHandler(TodoServiceImpl todoService,AlbumServiceImpl albumService,PostServiceImpl postService, UserServiceImpl userService, GlobalExceptionHandler globalExceptionHandler) {
        this.userService = userService;
        this.globalExceptionHandler = globalExceptionHandler;
        this.postService = postService;
        this.albumService = albumService;
        this.todoService = todoService;
    }

    @Override
    public void routing(HttpRules rules) {

        rules.get("/", this::findAll);
        rules.get("/{id}", this::findById);
        rules.get("/{id}/posts", this::findPostByUserId);
        rules.get("/{id}/albums", this::findAlbumsByUserId);
        rules.get("/{id}/todos", this::findATodoByUserId);
        rules.post("/", this::save);
        rules.put("/{id}", this::update);
        rules.delete("/{id}", this::delete);

    }




    private void findAll(ServerRequest request,
                         ServerResponse response) {

        execute(response, () ->
                response.send(userService.findAll()));
    }
    // flujo
    private void findPostByUserId(ServerRequest request,
                           ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(postService.findByUserId(id));
        });
    }

    private void findAlbumsByUserId(ServerRequest request, ServerResponse response) {
        execute(response, () -> {

            Integer id = getId(request);

            response.send(albumService.findByUserId(id));
        });
    }

    private void findATodoByUserId(ServerRequest serverRequest, ServerResponse serverResponse) {
        execute(serverResponse, () -> {

            Integer id = getId(serverRequest);

            serverResponse.send(todoService.findByUserId(id));
        });

    }


    private void findById(ServerRequest request,
                          ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(userService.findById(id));
        });
    }

    private void save(ServerRequest request,
                      ServerResponse response) {

        execute(response, () -> {

            User user = request.content().as(User.class);

            User saved = userService.save(user);

            response.status(Status.CREATED_201)
                    .send(saved);
        });
    }

    private void update(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            User user = request.content().as(User.class);

            User updated = userService.update(id, user);

            response.send(updated);
        });
    }

    private void delete(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            userService.delete(id);

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