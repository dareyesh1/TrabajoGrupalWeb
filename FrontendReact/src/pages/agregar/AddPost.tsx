import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import {
    Box,
    CardContent,
    TextField,
    Typography,
    Button,
    Card,
    CardActions,
    Divider
} from "@mui/material";

function AddPost() {
    const url = "/api/posts";
    const navigate = useNavigate();

    // 1. Capturamos el ID del usuario directamente desde la URL
    // Esto asume que tu ruta es algo como: path="/usuarios/:userId/add-post"
    const { userId } = useParams();

    // 2. Estado solo con los campos que el usuario sí debe llenar
    const [post, setPost] = useState({
        title: "",
        body: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPost({
            ...post,
            [name]: value
        });
    };

    const handleGuardar = () => {
        // 3. Armamos el JSON inyectando el ID que capturamos de la URL
        const payload = {
            title: post.title,
            body: post.body,
            user: {
                id: Number(userId) // Se convierte a número automáticamente
            }
        };

        axios.post(url, payload)
            .then(response => {
                alert("Post creado exitosamente");
                // Redirige de vuelta a la lista de posts de ese usuario
                navigate(`/posts`);
            })
            .catch(error => alert("Error al crear el post: " + error));
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Agregar Nuevo Post
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="h6">Detalles del Post</Typography>

                    <TextField
                        label="Título"
                        name="title"
                        value={post.title}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Contenido (Body)"
                        name="body"
                        value={post.body}
                        fullWidth
                        multiline
                        rows={6}
                        onChange={handleChange}
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Crear Post
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default AddPost;