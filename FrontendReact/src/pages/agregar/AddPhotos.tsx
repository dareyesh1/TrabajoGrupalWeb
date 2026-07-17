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

function AddPhoto() {
    const url = "/api/photos";
    const navigate = useNavigate();

    // 1. Capturamos el ID del álbum directamente desde la URL
    // Esto asume que tu ruta es algo como: path="/albums/:albumId/add-photo"
    const { albumId } = useParams();

    // 2. Estado solo con los campos que el usuario sí debe llenar
    const [photo, setPhoto] = useState({
        title: "",
        url: "",
        thumbnailUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPhoto({
            ...photo,
            [name]: value
        });
    };

    const handleGuardar = () => {
        // 3. Armamos el JSON inyectando el ID del álbum capturado
        const payload = {
            title: photo.title,
            url: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
            album: {
                id: Number(albumId) // Convertido a número para Helidon
            }
        };

        axios.post(url, payload)
            .then(response => {
                alert("Foto agregada exitosamente");
                // Volvemos a la pantalla anterior (la lista de fotos de ese álbum)
                navigate(-1);
            })
            .catch(error => alert("Error al agregar la foto: " + error));
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Agregar Nueva Foto
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="h6">Detalles de la Imagen</Typography>

                    <TextField
                        label="Título"
                        name="title"
                        value={photo.title}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="URL de la Foto"
                        name="url"
                        value={photo.url}
                        fullWidth
                        onChange={handleChange}
                        helperText="Ej: https://misitio.com/imagen.jpg"
                    />

                    <TextField
                        label="URL de la Miniatura (Thumbnail)"
                        name="thumbnailUrl"
                        value={photo.thumbnailUrl}
                        fullWidth
                        onChange={handleChange}
                        helperText="Ej: https://misitio.com/miniatura.jpg"
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Guardar Foto
                    </Button>
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default AddPhoto;