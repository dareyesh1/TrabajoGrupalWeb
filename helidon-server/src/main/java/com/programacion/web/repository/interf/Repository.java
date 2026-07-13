package com.programacion.web.repository.interf;

import java.util.List;
import java.util.Optional;

public interface Repository<T> {

    List<T> findAll();

    Optional<T> findById(Integer id);

    T save(T entity);

    T update(Integer id, T entity);

    void delete(Integer id);
}
