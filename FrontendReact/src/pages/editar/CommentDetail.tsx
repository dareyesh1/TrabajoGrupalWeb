import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import {
    Box,
    CardContent,
    TextField,
    Typography,
    Button,
    Card,
    CardActions
} from "@mui/material";

import type {Comment} from "../../models/Post";

function CommentDetail() {
    const url = "/api/comments";
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estado inicial del comentario
    const [comment, setComment] = useState<Comment>({
        id: 0,
        name: "",
        email: "",
        body: ""
    });

    useEffect(() => {
        axios.get<Comment>(`${url}/${id}`)
            .then(response => setComment(response.data))
            .catch(error => alert("Error al cargar el comentario: " + error));
    }, [id]);

    const handleGuardar = () => {
        axios.put<Comment>(`${url}/${id}`, comment)
            .then(response => {
                setComment(response.data);
                alert("Comentario actualizado correctamente");
                navigate(-1); // Regresa de forma inteligente a la vista anterior
            })
            .catch(error => alert("Error al actualizar: " + error));
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                            Editar Comentario
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
                            <b>ID: {comment.id}</b>
                        </Typography>
                    </Box>

                    <TextField
                        label="Nombre / Título"
                        variant="outlined"
                        value={comment.name}
                        fullWidth
                        onChange={e => setComment({ ...comment, name: e.target.value })}
                    />

                    <TextField
                        label="Correo Electrónico"
                        variant="outlined"
                        type="email"
                        value={comment.email}
                        fullWidth
                        onChange={e => setComment({ ...comment, email: e.target.value })}
                    />

                    <TextField
                        label="Comentario"
                        variant="outlined"
                        value={comment.body}
                        multiline
                        rows={4}
                        fullWidth
                        onChange={e => setComment({ ...comment, body: e.target.value })}
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 1 }}>

                    <Button variant="contained" color="primary" size="large" onClick={handleGuardar}>
                        Guardar
                    </Button>

                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        onClick={() => navigate(-1)}
                    >
                        Regresar
                    </Button>

                </CardActions>
            </Card>
        </Box>
    );
}

export default CommentDetail;