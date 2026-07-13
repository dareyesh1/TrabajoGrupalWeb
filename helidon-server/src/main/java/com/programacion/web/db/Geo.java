package com.programacion.web.db;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class Geo {
    private BigDecimal lat;
    private BigDecimal lng;
}
