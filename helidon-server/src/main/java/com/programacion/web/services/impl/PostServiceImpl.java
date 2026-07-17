package com.programacion.web.services.impl;

import com.programacion.web.db.Post;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.PostRepository;
import com.programacion.web.repository.impl.UserRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;
import java.util.Optional;

public class PostServiceImpl implements Service<Post> {

    private final PostRepository repository;
    private final UserRepository userRepository;

    public PostServiceImpl(PostRepository repository,
                           UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Post> findAll() {
        return repository.findAll();
    }

    @Override
    public Post findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el post con id " + id));
    }


    public List<Post> findByUserId(Integer id) {

        return repository.findByUserId(id);

    }



    @Override
    public Post save(Post post) {

        if (post.getId() != null &&
                repository.findById(post.getId()).isPresent()) {

            throw new ConflictException(
                    "Ya existe un post con id " + post.getId());
        }

        Integer userId = post.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.save(post);
    }


    @Override
    public Post update(Integer id, Post post) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el post con id " + id));

        Integer userId = post.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.update(id, post);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el post con id " + id));

        repository.delete(id);
    }

}