import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, CardContent, TextField, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardAction from '@mui/material/CardActionArea';
import type { Post } from "../../models/Post";


function PostsDetail() {

    const url = "/api/posts";
    const {id} = useParams<{id: string}>();
    const [post, setPost] = useState<Post>({id: 0, title: "", body: ""});

    useEffect(() => {
        axios.get<Post>(`${url}/${id}`)
            .then(response => setPost(response.data))
            .catch(error => alert("Error: " + error));
    }, [id]);


    //Post
    const handleGuardar = () => {
        axios.put<Post>(`${url}/${id}`, post)
            .then(response => {
                //Hacer algo con el post
                setPost(response.data);
                alert("Post actualizado");
            })
            .catch(error => alert("Error: " + error));
    };


    return (
        <>
            {/*<Button variant="contained" component={Link} to={`/posts`}>*/}
            {/*    Regresar*/}
            {/*</Button>*/}

            <Box sx={{maxWidth: "600", margin: "20px auto", px: 2}}>
                <Card variant={"outlined"} sx={{borderRadius: 3}}>
                    <CardContent sx={{display: "flex", flexDirection: "column"}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant="h6" component="h2" sx={{fontWeight: "bold"}}>
                                Editar Post
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{fontWeight: "bold"}}>
                                <b>ID: {post.id}</b>
                            </Typography>
                        </Box>

                        <TextField
                            label= {"Titulo del post"}
                            variant="outlined"
                            value={post.title}
                            fullWidth
                            onChange={e => setPost({...post, title: e.target.value})}
                        />

                        <TextField
                            label= {"Contenido"}
                            variant="outlined"
                            value={post.body}
                            multiline
                            rows={4}
                            fullWidth
                            onChange={e => setPost({...post, body: e.target.value})}
                        />

                    </CardContent>

                    <CardAction sx={{justifyContent: "flex-end", px: 4, pb: 4}}>

                        <Button variant="contained" color="primary" size="large" onClick={handleGuardar}>
                            Guardar
                        </Button>

                        <Button variant="outlined"
                                color="inherit"
                                size="large"
                                component={Link}
                                to={`/posts`}
                        >
                            Regresar
                        </Button>

                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            size={"large"}
                            component={Link}
                            to={`/posts/${post.id}/comments`}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                fontWeight: "bold"
                            }}
                        >
                            Ver Comentarios
                        </Button>


                    </CardAction>
                </Card>

            </Box>

        </>
    )
}

export default PostsDetail