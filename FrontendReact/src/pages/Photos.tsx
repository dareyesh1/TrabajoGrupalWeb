import { useEffect, useState } from "react";
import type { Photo } from "../models/Photo";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress,
    CardMedia,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function Photos() {

    const { albumId } = useParams<{ albumId?: string }>();

    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);


        const endpoint = albumId
            ? `/api/albums/${albumId}/photos`
            : "/api/photos";

        axios
            .get<Photo[]>(endpoint)
            .then((response) => setPhotos(response.data))
            .catch((error) => alert("Error: " + error))
            .finally(() => setLoading(false));
    }, [albumId]);

    const handleDelete = (id: number) => {
        axios
            .delete(`/api/photos/${id}`)
            .then(() => {
                setPhotos(photos.filter((p) => p.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {albumId ? `Fotos del Álbum (ID: ${albumId})` : "Todas las Fotos"}
                </Typography>

                {albumId && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={`/photos/${albumId}/new`}
                    >
                        Agregar Foto
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                    gap: 3
                }}>
                    {photos.map((photo) => (
                        <Card key={photo.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                            <CardMedia
                                component="img"
                                height="200"
                                image={photo.thumbnailUrl}
                                alt={photo.title}
                            />

                            <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ flexGrow: 1, mb: 2 }}>
                                    {photo.title}
                                </Typography>

                                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/photos/${photo.id}`}
                                    >
                                        Detalle
                                    </Button>

                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(photo.id)}
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

export default Photos;