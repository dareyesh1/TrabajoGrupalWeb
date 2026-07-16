package com.programacion.web.services.impl;

import com.programacion.web.db.Todo;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.TodoRepository;
import com.programacion.web.repository.impl.UserRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;

public class TodoServiceImpl implements Service<Todo> {

    private final TodoRepository repository;
    private final UserRepository userRepository;

    public TodoServiceImpl(TodoRepository repository,
                           UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Todo> findAll() {
        return repository.findAll();
    }

    @Override
    public Todo findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la tarea con id " + id));
    }

    @Override
    public Todo save(Todo todo) {

        if (todo.getId() != null &&
                repository.findById(todo.getId()).isPresent()) {

            throw new ConflictException(
                    "Ya existe una tarea con id " + todo.getId());
        }

        Integer userId = todo.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.save(todo);
    }

    @Override
    public Todo update(Integer id, Todo todo) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la tarea con id " + id));

        Integer userId = todo.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.update(id, todo);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la tarea con id " + id));

        repository.delete(id);
    }

}