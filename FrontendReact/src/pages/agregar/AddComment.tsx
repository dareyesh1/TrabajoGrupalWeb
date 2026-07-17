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

function AddComment() {
    const url = "/api/comments";
    const navigate = useNavigate();

    // 1. Capturamos el ID del post directamente desde la URL
    // Esto asume que tu ruta es algo como: path="/posts/:postId/add-comment"
    const { postId } = useParams();

    // 2. Estado solo con los campos que el usuario sí debe llenar
    const [comment, setComment] = useState({
        name: "",
        email: "",
        body: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setComment({
            ...comment,
            [name]: value
        });
    };

    const handleGuardar = () => {
        const payload = {
            name: comment.name,
            email: comment.email,
            body: comment.body,
            post: {
                id: Number(postId) // Se convierte a número automáticamente
            }
        };

        axios.post(url, payload)
            .then(response => {
                alert("Comentario creado exitosamente");
                // Redirige a la lista general de comentarios (o donde prefieras)
                navigate(`/comments`);
            })
            .catch(error => alert("Error al crear el comentario: " + error));
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Agregar Nuevo Comentario
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="h6">Detalles del Comentario</Typography>

                    <TextField
                        label="Nombre"
                        name="name"
                        value={comment.name}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        value={comment.email}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Contenido (Body)"
                        name="body"
                        value={comment.body}
                        fullWidth
                        multiline
                        rows={4}
                        onChange={handleChange}
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Crear Comentario
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default AddComment;