import { useEffect, useState } from "react";
import type { Todo } from "../models/Todo";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
    Container,
    Typography,
    Card,
    CardContent,
    Checkbox,
    Button,
    Box,
    CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
function Todos() {
    const { userId } = useParams<{ userId?: string }>();

    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // 2. Determinamos el endpoint dinámicamente
        const endpoint = userId
            ? `/api/users/${userId}/todos`
            : "/api/todos";

        axios
            .get<Todo[]>(endpoint)
            .then((response) => setTodos(response.data))
            .catch((error) => alert("Error: " + error))
            .finally(() => setLoading(false));
    }, [userId]);
    const handleToggleComplete = (id: number) => {
        const todo = todos.find((t) => t.id === id);
        if (todo) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            axios
                .put(`/api/todos/${id}`, updatedTodo)
                .then(() => {
                    setTodos(
                        todos.map((t) => (t.id === id ? updatedTodo : t))
                    );
                })
                .catch((error) => alert("Error: " + error));
        }
    };

    const handleDelete = (id: number) => {
        axios
            .delete(`/api/todos/${id}`)
            .then(() => {
                setTodos(todos.filter((t) => t.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4">
                    {userId ? `Tareas del Usuario (ID: ${userId})` : "Todas las Tareas"}
                </Typography>

                {userId && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        component={Link}
                        to={`/todos/${userId}/new`}
                    >
                        Agregar Tarea
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {todos.map((todo) => (
                        <Card
                            key={todo.id}
                            sx={{
                                p: 2,
                                opacity: todo.completed ? 0.6 : 1, // Feedback visual cuando está completada
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    p: 0,
                                    "&:last-child": { pb: 0 } // Quita el padding bottom extra de MUI
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <Checkbox
                                        checked={todo.completed}
                                        onChange={() => handleToggleComplete(todo.id)}
                                        color="primary"
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            textDecoration: todo.completed
                                                ? "line-through"
                                                : "none",
                                            color: todo.completed ? "text.secondary" : "text.primary"
                                        }}
                                    >
                                        {todo.title}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <Button
                                        size="small"
                                        startIcon={<EditIcon />}
                                        variant="outlined"
                                        component={Link}
                                        to={`/todos/${todo.id}`} // Redirige a TodoDetail
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        size="small"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(todo.id)}
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

export default Todos;