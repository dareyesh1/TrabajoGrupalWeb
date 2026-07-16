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
public class Comment {


    private Integer id;
    private String name;
    private String email;
    private String body;
    private Post post;

}
