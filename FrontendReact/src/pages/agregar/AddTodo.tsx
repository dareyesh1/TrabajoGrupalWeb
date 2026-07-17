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
    Divider,
    FormControlLabel,
    Checkbox
} from "@mui/material";

function AddTodo() {
    const url = "/api/todos"; // Ruta para los todos
    const navigate = useNavigate();
    const {userId} = useParams();
    // 1. Estado inicial para crear un Todo
    const [todo, setTodo] = useState({
        title: "",
        completed: false,
        user:{id: userId ? parseInt(userId) : 0}
    });

    // 2. Manejador de cambios adaptado para textos y checkboxes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setTodo({
            ...todo,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // 3. Función para enviar el POST
    const handleGuardar = () => {


        axios.post(url, todo)
            .then(response => {
                alert("Todo creado exitosamente");
                navigate("/todos"); // Redirige a la lista de todos
            })
            .catch(error => alert("Error al crear el Todo: " + error));
    };

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Agregar Nuevo Todo
                        </Typography>
                    </Box>

                    <Divider />

                    <Typography variant="h6">Detalles de la Tarea</Typography>

                    <TextField
                        label="Título"
                        name="title"
                        value={todo.title}
                        fullWidth
                        onChange={handleChange}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                name="completed"
                                checked={todo.completed}
                                onChange={handleChange}
                                color="primary"
                            />
                        }
                        label="¿Está completado?"
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleGuardar}>
                        Crear Todo
                    </Button>
                    <Button variant="outlined" component={Link} to="/todos">
                        Cancelar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default AddTodo;