import { useEffect, useState } from "react";
import type { Comment } from "../models/Post";
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
import AddIcon from "@mui/icons-material/Add";

function Comments() {
    const { postId } = useParams<{ postId?: string }>();

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const endpoint = postId
            ? `/api/posts/${postId}/comments`
            : "/api/comments";

        axios
            .get<Comment[]>(endpoint)
            .then((response) => setComments(response.data))
            .catch((error) => alert("Error: " + error))
            .finally(() => setLoading(false));
    }, [postId]);

    const handleDelete = (id: number) => {
        axios
            .delete(`/api/comments/${id}`)
            .then(() => {
                setComments(comments.filter((c) => c.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {postId ? `Comentarios del Post (ID: ${postId})` : "Todos los Comentarios"}
                </Typography>

                {postId && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={`/comments/${postId}/new`}
                    >
                        Agregar Comentario
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {comments.map((comment) => (
                        <Card key={comment.id} sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{comment.name}</Typography>
                                <Typography variant="caption" color="primary" sx={{ display: 'block', mb: 1 }}>
                                    De: {comment.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {comment.body}
                                </Typography>

                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        size="small"
                                        component={Link}
                                        to={`/comments/${comment.id}`}
                                    >
                                        Ver Detalle
                                    </Button>

                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(comment.id)}
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

export default Comments;