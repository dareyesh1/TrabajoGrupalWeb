import { useParams, Link } from "react-router-dom";
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
    Divider
} from "@mui/material";

import type { User } from "../../models/User";

function UserDetail() {
    const url = "/api/users";
    const { id } = useParams<{ id: string }>();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios.get<User>(`${url}/${id}`)
            .then(response => setUser(response.data))
            .catch(error => alert("Error: " + error));
    }, [id]);

    const handleGuardar = () => {
        if (!user) return;

        axios.put<User>(`${url}/${id}`, user)
            .then(response => {
                setUser(response.data);
                alert("Usuario actualizado");
            })
            .catch(error => alert("Error: " + error));
    };

    // NUEVA FUNCIÓN: Manejador centralizado
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;

        const { name, value } = e.target;

        if (name.startsWith("address.")) {
            const field = name.split(".")[1];
            setUser({
                ...user,
                address: { ...user.address, [field]: value }
            });
        } else if (name.startsWith("company.")) {
            const field = name.split(".")[1];
            setUser({
                ...user,
                company: { ...user.company, [field]: value }
            });
        } else {
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            Editar Usuario
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* DATOS PERSONALES */}
                    <Typography variant="h6">Datos Personales</Typography>

                    <TextField
                        label="Nombre"
                        name="name"
                        value={user.name}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Username"
                        name="username"
                        value={user.username}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        value={user.email}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Phone"
                        name="phone"
                        value={user.phone}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Website"
                        name="website"
                        value={user.website}
                        fullWidth
                        onChange={handleChange}
                    />

                    <Divider />

                    {/* ADDRESS */}
                    <Typography variant="h6">Dirección</Typography>

                    <TextField
                        label="Street"
                        name="address.street"
                        value={user.address.street}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Suite"
                        name="address.suite"
                        value={user.address.suite}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="City"
                        name="address.city"
                        value={user.address.city}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Zipcode"
                        name="address.zipcode"
                        value={user.address.zipcode}
                        fullWidth
                        onChange={handleChange}
                    />

                    <Divider />

                    {/* COMPANY */}
                    <Typography variant="h6">Empresa</Typography>

                    <TextField
                        label="Company Name"
                        name="company.name"
                        value={user.company.name}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="Catch Phrase"
                        name="company.catchPhrase"
                        value={user.company.catchPhrase}
                        fullWidth
                        onChange={handleChange}
                    />

                    <TextField
                        label="BS"
                        name="company.bs"
                        value={user.company.bs}
                        fullWidth
                        onChange={handleChange}
                    />

                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end", px: 4, pb: 4, gap: 2 }}>
                    <Button variant="contained" onClick={handleGuardar}>
                        Guardar
                    </Button>
                    <Button variant="outlined" component={Link} to="/users">
                        Regresar
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default UserDetail;