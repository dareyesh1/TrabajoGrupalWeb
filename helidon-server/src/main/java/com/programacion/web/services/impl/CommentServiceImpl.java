package com.programacion.web.services.impl;

import com.programacion.web.db.Comment;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.CommentRepository;
import com.programacion.web.repository.impl.PostRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;

public class CommentServiceImpl implements Service<Comment> {

    private final CommentRepository repository;
    private final PostRepository postRepository;

    public CommentServiceImpl(CommentRepository repository,
                              PostRepository postRepository) {

        this.repository = repository;
        this.postRepository = postRepository;
    }

    @Override
    public List<Comment> findAll() {
        return repository.findAll();
    }

    @Override
    public Comment findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el comentario con id " + id));
    }

    public List<Comment> findByPostId(Integer id) {

        return repository.findByPostId(id);

    }

    @Override
    public Comment save(Comment comment) {

        if (comment.getId() != null &&
                repository.findById(comment.getId()).isPresent()) {

            throw new ConflictException(
                    "Ya existe un comentario con id " + comment.getId());
        }

        Integer postId = comment.getPost().getId();

        postRepository.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el post con id " + postId));

        return repository.save(comment);
    }

    @Override
    public Comment update(Integer id, Comment comment) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el comentario con id " + id));

        Integer postId = comment.getPost().getId();

        postRepository.findById(postId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el post con id " + postId));

        return repository.update(id, comment);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el comentario con id " + id));

        repository.delete(id);
    }

}