package com.programacion.web.db;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Company {
    private String name;
    private String catchPhrase;
    private String bs;
}
