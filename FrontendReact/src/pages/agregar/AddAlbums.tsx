import {Link, useNavigate, useParams} from "react-router-dom";
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

function AddAlbum() {
    const url = "/api/albums"; // Ruta para los álbumes
    const navigate = useNavigate();
    const { userId } = useParams();
    // 1. Estado inicial solo con las propiedades requeridas para crear
    const [album, setAlbum] = useState({
        title: "",
        userId: userId
    });

    // 2. Manejador de cambios
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAlbum({
            ...album,
            [name]: value
        });
    };

    // 3. Función para enviar el POST
    const handleGuardar = () => {
        const payload = {
            title: album.title,
            user: {
                id: Number(userId)
            }
        };
        axios.post(url, payload)
            .then(response => {
                alert("Álbum creado exitosamente");
                navigate("/albums"); // Redirige a la lista de álbumes
            })
            .catch(error => alert("Error al crear el álbum: " + error));
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Agregar Nuevo Álbum
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="h6">Detalles del Álbum</Typography>

                    <TextField
                        label="Título"
                        name="title"
                        value={album.title}
                        fullWidth
                        onChange={handleChange}
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Crear Álbum
                    </Button>
                    <Button variant="outlined" component={Link} to="/albums">
                        Cancelar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default AddAlbum;