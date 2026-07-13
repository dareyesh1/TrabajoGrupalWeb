package com.programacion.web.db;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class Address {

    private String street;
    private String suite;
    private String city;
    private String zipcode;
    private Geo geo;

}
