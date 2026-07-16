package com.programacion.web.handler;

import com.programacion.web.db.Album;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.services.impl.AlbumServiceImpl;
import com.programacion.web.services.interf.Service;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class AlbumHandler implements HttpService {

    private final Service<Album> albumService;
    private final GlobalExceptionHandler globalExceptionHandler;

    public AlbumHandler(Service<Album> albumService,
                        GlobalExceptionHandler globalExceptionHandler) {

        this.albumService = albumService;
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
                response.send(albumService.findAll()));
    }

    private void findById(ServerRequest request,
                          ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            response.send(albumService.findById(id));
        });
    }

    private void save(ServerRequest request,
                      ServerResponse response) {

        execute(response, () -> {

            Album album = request.content().as(Album.class);

            Album saved = albumService.save(album);

            response.status(Status.CREATED_201)
                    .send(saved);
        });
    }

    private void update(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            Album album = request.content().as(Album.class);

            Album updated = albumService.update(id, album);

            response.send(updated);
        });
    }

    private void delete(ServerRequest request,
                        ServerResponse response) {

        execute(response, () -> {

            Integer id = getId(request);

            albumService.delete(id);

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