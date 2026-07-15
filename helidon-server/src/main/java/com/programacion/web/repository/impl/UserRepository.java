package com.programacion.web.repository.impl;

import com.programacion.web.db.Address;
import com.programacion.web.db.Company;
import com.programacion.web.db.Geo;
import com.programacion.web.db.User;
import com.programacion.web.repository.interf.Repository;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public class UserRepository implements Repository<User> {

    private final DbClient dbClient;

    public UserRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }


    @Override
    public List<User> findAll() {

        return dbClient.execute()
                .createQuery("SELECT * FROM users ORDER BY id")
                .execute()
                .map(this::mapRowToUser)
                .toList();
    }

    @Override
    public Optional<User> findById(Integer id) {
        return dbClient.execute()
                .createQuery("""
                    SELECT *
                    FROM users
                    WHERE id = :id
                    """)
                .addParam("id", id)
                .execute()
                .map(this::mapRowToUser)
                .findFirst();
    }

    @Override
    public User save(User user) {

        dbClient.execute()
                .createInsert("""
                INSERT INTO users(
                    name,
                    username,
                    email,
                    address_street,
                    address_suite,
                    address_city,
                    address_zipcode,
                    address_geo_lat,
                    address_geo_lng,
                    phone,
                    website,
                    company_name,
                    company_catch_phrase,
                    company_bs
                )
                VALUES(
                    :name,
                    :username,
                    :email,
                    :street,
                    :suite,
                    :city,
                    :zipcode,
                    :lat,
                    :lng,
                    :phone,
                    :website,
                    :companyName,
                    :catchPhrase,
                    :bs
                )
                """)
                .addParam("name", user.getName())
                .addParam("username", user.getUsername())
                .addParam("email", user.getEmail())
                .addParam("street", user.getAddress().getStreet())
                .addParam("suite", user.getAddress().getSuite())
                .addParam("city", user.getAddress().getCity())
                .addParam("zipcode", user.getAddress().getZipcode())
                .addParam("lat", user.getAddress().getGeo().getLat())
                .addParam("lng", user.getAddress().getGeo().getLng())
                .addParam("phone", user.getPhone())
                .addParam("website", user.getWebsite())
                .addParam("companyName", user.getCompany().getName())
                .addParam("catchPhrase", user.getCompany().getCatchPhrase())
                .addParam("bs", user.getCompany().getBs())
                .execute();

        return user;
    }

    @Override
    public User update(Integer id, User user) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        dbClient.execute()
                .createUpdate("""
                UPDATE users
                SET
                    name = :name,
                    username = :username,
                    email = :email,
                    address_street = :street,
                    address_suite = :suite,
                    address_city = :city,
                    address_zipcode = :zipcode,
                    address_geo_lat = :lat,
                    address_geo_lng = :lng,
                    phone = :phone,
                    website = :website,
                    company_name = :companyName,
                    company_catch_phrase = :catchPhrase,
                    company_bs = :bs
                WHERE id = :id
                """)
                .addParam("id", id)
                .addParam("name", user.getName())
                .addParam("username", user.getUsername())
                .addParam("email", user.getEmail())
                .addParam("street", user.getAddress().getStreet())
                .addParam("suite", user.getAddress().getSuite())
                .addParam("city", user.getAddress().getCity())
                .addParam("zipcode", user.getAddress().getZipcode())
                .addParam("lat", user.getAddress().getGeo().getLat())
                .addParam("lng", user.getAddress().getGeo().getLng())
                .addParam("phone", user.getPhone())
                .addParam("website", user.getWebsite())
                .addParam("companyName", user.getCompany().getName())
                .addParam("catchPhrase", user.getCompany().getCatchPhrase())
                .addParam("bs", user.getCompany().getBs())
                .execute();

        user.setId(id);

        return user;
    }

    @Override
    public void delete(Integer id) {

        findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Usuario no encontrado"));

        dbClient.execute()
                .createDelete("""
                DELETE FROM users
                WHERE id = :id
                """)
                .addParam("id", id)
                .execute();
    }

    //METODOS AUXILIARES PARA EVITAR REPETICION DE CODIGO

    private String getString(DbRow row, String column) {
        return row.column(column)
                .as(String.class)
                .orElse(null);
    }

    private Integer getInteger(DbRow row, String column) {
        return row.column(column)
                .as(Integer.class)
                .orElse(null);
    }

    private BigDecimal getBigDecimal(DbRow row, String column) {
        return row.column(column)
                .as(BigDecimal.class)
                .orElse(null);
    }

    //EL MAPPER ESTA MAS LIGERO

    private User mapRowToUser(DbRow row) {

        Geo geo = Geo.builder()
                .lat(getBigDecimal(row, "address_geo_lat"))
                .lng(getBigDecimal(row, "address_geo_lng"))
                .build();

        Address address = Address.builder()
                .street(getString(row, "address_street"))
                .suite(getString(row, "address_suite"))
                .city(getString(row, "address_city"))
                .zipcode(getString(row, "address_zipcode"))
                .geo(geo)
                .build();

        Company company = Company.builder()
                .name(getString(row, "company_name"))
                .catchPhrase(getString(row, "company_catch_phrase"))
                .bs(getString(row, "company_bs"))
                .build();

        return User.builder()
                .id(getInteger(row, "id"))
                .name(getString(row, "name"))
                .username(getString(row, "username"))
                .email(getString(row, "email"))
                .address(address)
                .phone(getString(row, "phone"))
                .website(getString(row, "website"))
                .company(company)
                .build();
    }
}
