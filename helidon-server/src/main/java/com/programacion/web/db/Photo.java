package com.programacion.web.db;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Photo {

    private Integer id;
    private String title;
    private String url;
    private String thumbnailUrl;
    private Album album;

}