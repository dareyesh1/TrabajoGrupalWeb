package com.programacion.web.services.impl;

import com.programacion.web.db.Photo;
import com.programacion.web.exception.ConflictException;
import com.programacion.web.exception.ResourceNotFoundException;
import com.programacion.web.repository.impl.AlbumRepository;
import com.programacion.web.repository.impl.PhotoRepository;
import com.programacion.web.services.interf.Service;

import java.util.List;

public class PhotoServiceImpl implements Service<Photo> {

    private final PhotoRepository repository;
    private final AlbumRepository albumRepository;

    public PhotoServiceImpl(PhotoRepository repository,
                            AlbumRepository albumRepository) {

        this.repository = repository;
        this.albumRepository = albumRepository;
    }

    @Override
    public List<Photo> findAll() {
        return repository.findAll();
    }

    @Override
    public Photo findById(Integer id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la foto con id " + id));
    }

    @Override
    public Photo save(Photo photo) {

        if (photo.getId() != null &&
                repository.findById(photo.getId()).isPresent()) {

            throw new ConflictException(
                    "Ya existe una foto con id " + photo.getId());
        }

        Integer albumId = photo.getAlbum().getId();

        albumRepository.findById(albumId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el álbum con id " + albumId));

        return repository.save(photo);
    }

    @Override
    public Photo update(Integer id, Photo photo) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la foto con id " + id));

        Integer albumId = photo.getAlbum().getId();

        albumRepository.findById(albumId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe el álbum con id " + albumId));

        return repository.update(id, photo);
    }

    @Override
    public void delete(Integer id) {

        repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No existe la foto con id " + id));

        repository.delete(id);
    }

}