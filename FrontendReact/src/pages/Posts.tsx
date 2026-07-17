import { useEffect, useState } from "react";
import type { Post } from "../models/Post";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add"; // Asegúrate de tener este icono

function Posts() {
    const { userId } = useParams<{ userId?: string }>();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const endpoint = userId
            ? `/api/users/${userId}/posts`
            : "/api/posts";

        axios
            .get<Post[]>(endpoint)
            .then((response) => setPosts(response.data))
            .catch((error) => alert("Error: " + error))
            .finally(() => setLoading(false));
    }, [userId]);
    const handleDelete = (id: number) => {
        axios
            .delete(`/api/posts/${id}`)
            .then(() => {
                setPosts(posts.filter((t) => t.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {userId ? `Posts del Usuario (ID: ${userId})` : "Todos los Posts"}
                </Typography>

                {userId && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={`/posts/${userId}/new`}
                    >
                        Agregar Post
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {posts.map((post) => (
                        <Card key={post.id} sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{post.title}</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {post.body}
                                </Typography>
                                {post.user && (
                                    <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                                        Por: {post.user.name}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/posts/${post.id}`}
                                    >
                                        Ver Detalle
                                    </Button>

                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        size="small"

                                        color="primary"
                                        variant="contained"
                                        component={Link}
                                        to={`/posts/${post.id}/comments`}
                                    >
                                        Ver Comentarios
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

export default Posts;