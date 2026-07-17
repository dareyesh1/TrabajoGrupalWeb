package com.programacion.web;

import com.programacion.web.config.DbConfig;
import com.programacion.web.exception.GlobalExceptionHandler;
import com.programacion.web.handler.*;
import com.programacion.web.repository.impl.*;
import com.programacion.web.services.impl.*;
import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.webserver.WebServer;

public class HelidonServerMain {

    public static void main(String[] args) {

        //Esto es la configuracion del servidor
        Config config = Config.create();

        int port = config.get("server.port")
                .asInt()
                .orElse(8080);

        DbClient dbConfig = new DbConfig(config).getDbClient();

        GlobalExceptionHandler exceptionHandler =
                new GlobalExceptionHandler();

        //Para User
        UserRepository userRepository = new UserRepository(dbConfig);
        UserServiceImpl userService = new UserServiceImpl(userRepository);

        //Para Album
        AlbumRepository albumRepository = new AlbumRepository(dbConfig);
        AlbumServiceImpl albumService = new AlbumServiceImpl(albumRepository, userRepository);

        //Para Photo
        PhotoRepository photoRepository = new PhotoRepository(dbConfig);
        PhotoServiceImpl photoService = new PhotoServiceImpl(photoRepository, albumRepository);
        PhotoHandler photoHandler = new PhotoHandler(photoService, exceptionHandler);

        AlbumHandler albumHandler = new AlbumHandler(photoService,albumService, exceptionHandler);

        //Para Post
        PostRepository postRepository = new PostRepository(dbConfig);
        PostServiceImpl postService = new PostServiceImpl(postRepository, userRepository);

        //Para Comment
        CommentRepository commentRepository = new CommentRepository(dbConfig);
        CommentServiceImpl commentService = new CommentServiceImpl(commentRepository, postRepository);
        CommentHandler commentHandler = new CommentHandler(commentService, exceptionHandler);

        PostHandler postHandler = new PostHandler(commentService,postService, exceptionHandler);


        //Para Todo
        TodoRepository todoRepository = new TodoRepository(dbConfig);
        TodoServiceImpl todoService = new TodoServiceImpl(todoRepository, userRepository);
        TodoHandler todoHandler = new TodoHandler(todoService, exceptionHandler);

    //user

        UserHandler userHandler = new UserHandler( todoService,albumService,postService,userService, exceptionHandler);

        //Esto es como el MyApplication
        //Se registran los endpoints de las entidades
        WebServer server = WebServer.builder()
                .port(port)
                .routing(routing -> routing
                        .register("/api/users", userHandler)
                        .register("/api/albums", albumHandler)
                        .register("/api/photos", photoHandler)
                        .register("/api/posts", postHandler)
                        .register("/api/comments", commentHandler)
                        .register("/api/todos", todoHandler)
                )
                .build();

        server.start();

        System.out.printf(
                "Servidor iniciado en http://localhost:%d%n",
                port
        );
    }

}