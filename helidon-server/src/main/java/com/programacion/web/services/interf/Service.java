package com.programacion.web.services.interf;

import java.util.List;
import java.util.Optional;

public interface Service<T> {

    List<T> findAll();

    T findById(Integer id);

    T save(T user);

    T update(Integer id, T user);

    void delete(Integer id);
}
