package com.programacion.web.db;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Post {


    private Integer id;
    private String title;
    private String body;
    private User user;
    private List<Comment> comments;

}
