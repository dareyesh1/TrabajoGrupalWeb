package com.programacion.web.services.impl;

import com.programacion.web.db.Album;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.AlbumRepository;
import com.programacion.web.repository.impl.UserRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;

public class AlbumServiceImpl implements Service<Album> {

    private final AlbumRepository repository;
    private final UserRepository userRepository;

    public AlbumServiceImpl(AlbumRepository repository,
                            UserRepository userRepository) {

        this.repository = repository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Album> findAll() {
        return repository.findAll();
    }

    @Override
    public Album findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el álbum con id " + id));
    }

    @Override
    public Album save(Album album) {

        if (album.getId() != null && repository.findById(album.getId()).isPresent()) {
            throw new ConflictException(
                    "Ya existe un álbum con id " + album.getId());
        }

        Integer userId = album.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.save(album);
    }

    @Override
    public Album update(Integer id, Album album) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el álbum con id " + id));

        Integer userId = album.getUser().getId();

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el usuario con id " + userId));

        return repository.update(id, album);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el álbum con id " + id));

        repository.delete(id);
    }
}