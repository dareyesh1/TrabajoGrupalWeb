import { Link, useNavigate } from "react-router-dom";
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

function AddUser() {
  const url = "/api/users";
  const navigate = useNavigate(); // Hook para redirigir después de guardar

  // 1. Estado inicial en blanco con la estructura anidada lista
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: { lat: "", lng: "" }
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: ""
    }
  });

  // 2. El mismo handleChange centralizado que ya dominas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // 3. Función para enviar los datos nuevos (POST)
  const handleGuardar = () => {

    axios.post(url, user)
        .then(response => {
          alert("Usuario creado exitosamente");
          navigate("/users"); // Redirige a la tabla principal
        })
        .catch(error => alert("Error al crear: " + error));
  };

  return (
      <Box sx={{ maxWidth: 700, margin: "20px auto", px: 2 }}>
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Agregar Nuevo Usuario
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
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Crear Usuario
            </Button>
            <Button variant="outlined" component={Link} to="/users">
              Cancelar
            </Button>
          </CardActions>
        </Card>
      </Box>
  );
}

export default AddUser;