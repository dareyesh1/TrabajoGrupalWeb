import { useEffect, useState } from "react";
import type { Album } from "../models/Album";
import axios from "axios";
import { useParams, Link } from "react-router-dom"; // Importamos useParams
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Importamos el icono de agregar

function Albums() {
    // 1. Extraemos el userId de la URL (si existe)
    const { userId } = useParams<{ userId?: string }>();

    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // 2. Determinamos el endpoint dinámicamente
        const endpoint = userId
            ? `/api/users/${userId}/albums`
            : "/api/albums";

        axios
            .get<Album[]>(endpoint)
            .then((response) => setAlbums(response.data))
            .catch((error) => alert("Error: " + error))
            .finally(() => setLoading(false));
    }, [userId]); // El useEffect depende del userId

    const handleDelete = (id: number) => {
        axios
            .delete(`/api/albums/${id}`)
            .then(() => {
                setAlbums(albums.filter((t) => t.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            {/* Contenedor flexible para el Título y el Botón de Agregar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {/* Título dinámico mostrando el ID */}
                    {userId ? `Álbumes del Usuario (ID: ${userId})` : "Todos los Álbumes"}
                </Typography>

                {/* 3. Renderizado condicional del botón de agregar */}
                {userId && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={`/albums/${userId}/new`} // Redirige al form de crear álbum
                    >
                        Agregar Álbum
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {albums.map((album) => (
                        <Card key={album.id} sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{album.title}</Typography>
                                {album.user && (
                                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                                        De: {album.user.name}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/albums/${album.id}`}
                                    >
                                        Ver Detalle
                                    </Button>

                                    <Button
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/albums/${album.id}/photos`}
                                    >
                                        Fotos ({album.photos?.length || 0})
                                    </Button>

                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(album.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}
        </Container>
    );
}

export default Albums;