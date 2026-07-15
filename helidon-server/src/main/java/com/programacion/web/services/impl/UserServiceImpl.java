package com.programacion.web.services.impl;

import com.programacion.web.db.User;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.UserRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;
import java.util.Optional;

public class UserServiceImpl implements Service<User> {

    private final UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<User> findAll() {
        return repository.findAll();
    }

    @Override
    public User findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + id));
    }

    @Override
    public User save(User user) {

        if (repository.findById(user.getId()).isPresent()) {
            throw new ConflictException(
                    "Ya existe un usuario con id " + user.getId());
        }

        return repository.save(user);
    }

    @Override
    public User update(Integer id, User user) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + id));

        return repository.update(id, user);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + id));

        repository.delete(id);
    }
}