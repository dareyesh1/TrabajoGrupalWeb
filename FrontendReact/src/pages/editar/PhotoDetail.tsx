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

import type { Photo } from "../../models/Photo";

function PhotoDetail() {
    const url = "/api/photos";
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estado inicial de la foto
    const [photo, setPhoto] = useState<Photo>({
        id: 0,
        title: "",
        url: "",
        thumbnailUrl: ""
    });

    useEffect(() => {
        axios.get<Photo>(`${url}/${id}`)
            .then(response => setPhoto(response.data))
            .catch(error => alert("Error al cargar la foto: " + error));
    }, [id]);

    const handleGuardar = () => {
        axios.put<Photo>(`${url}/${id}`, photo)
            .then(response => {
                setPhoto(response.data);
                alert("Foto actualizada correctamente");
                navigate(-1); // Regresa inteligentemente a la vista anterior
            })
            .catch(error => alert("Error al actualizar: " + error));
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                            Editar Foto
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
                            <b>ID: {photo.id}</b>
                        </Typography>
                    </Box>

                    {/* Previsualización de la foto */}
                    {photo.url && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <img
                                src={photo.url}
                                alt={photo.title}
                                style={{ maxWidth: "100%", maxHeight: "300px", borderRadius: "8px" }}
                            />
                        </Box>
                    )}

                    <TextField
                        label="Título de la Foto"
                        variant="outlined"
                        value={photo.title}
                        fullWidth
                        onChange={e => setPhoto({ ...photo, title: e.target.value })}
                    />

                    <TextField
                        label="URL de la imagen original"
                        variant="outlined"
                        value={photo.url}
                        fullWidth
                        onChange={e => setPhoto({ ...photo, url: e.target.value })}
                    />

                    <TextField
                        label="URL de la miniatura (Thumbnail)"
                        variant="outlined"
                        value={photo.thumbnailUrl}
                        fullWidth
                        onChange={e => setPhoto({ ...photo, thumbnailUrl: e.target.value })}
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

export default PhotoDetail;