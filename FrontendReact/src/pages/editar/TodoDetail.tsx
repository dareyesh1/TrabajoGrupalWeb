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
    CardActions,
    FormControlLabel,
    Checkbox
} from "@mui/material";

import type { Todo } from "../../models/Todo";

function TodoDetail() {
    const url = "/api/todos";
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Estado inicial de la tarea
    const [todo, setTodo] = useState<Todo>({ id: 0, title: "", completed: false });

    // Cargar los datos de la tarea al montar
    useEffect(() => {
        axios.get<Todo>(`${url}/${id}`)
            .then(response => setTodo(response.data))
            .catch(error => alert("Error al cargar la tarea: " + error));
    }, [id]);

    // Guardar los cambios (PUT)
    const handleGuardar = () => {
        axios.put<Todo>(`${url}/${id}`, todo)
            .then(response => {
                setTodo(response.data);
                alert("Tarea actualizada correctamente");
                navigate(-1); // Regresa a la lista anterior
            })
            .catch(error => alert("Error al actualizar: " + error));
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                            Editar Tarea
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: "bold" }}>
                            <b>ID: {todo.id}</b>
                        </Typography>
                    </Box>

                    <TextField
                        label="Título de la tarea"
                        variant="outlined"
                        value={todo.title}
                        fullWidth
                        onChange={e => setTodo({ ...todo, title: e.target.value })}
                    />

                    {/* Checkbox para el estado de completado */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={todo.completed}
                                // Ojo aquí: usamos e.target.checked en lugar de e.target.value
                                onChange={e => setTodo({ ...todo, completed: e.target.checked })}
                                color="primary"
                            />
                        }
                        label="Marcar como completada"
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

export default TodoDetail;