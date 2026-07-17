import {useEffect, useState} from "react";
import type {User} from "../models/User.tsx";
import axios from "axios";
import {Box, Container, Typography} from "@mui/material";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import {Link} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

function Users(){

    const [user, setUser] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get<User[]>('/api/users')
            .then(response => setUser(response.data))
            .catch(error => alert("Error: " + error))
            .finally(() => setLoading(false));

    }, []);


    const handleDelete = (id: number) => {
        axios
            .delete(`/api/users/${id}`)
            .then(() => {
                setUser(user.filter((t) => t.id !== id));
            })
            .catch((error) => alert("Error: " + error));
    };
    return(
        <>
            <Container sx={{mt:4}}>
                <Typography variant="h4">
                    Usuarios

                    <Box sx={{ mt: 2, display: "inherit", gap: 2}}>

                        <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            component={Link}
                            to="/users/new"
                        >
                            Crear Usuario
                        </Button>
                        </Box>

                </Typography>

                {/* <Button variant="contained"
                    color="primary"
                    onClick={fetchPosts}
                >
                    {loading ? "Cargando..." : "Cargar Datos"}
                </Button> */}

                <Table sx={{mt:2}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Acción</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            user.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Button color={"secondary"} variant={"outlined"} component={Link} to={`/users/${user.id}`}>
                                            Ver Detalle
                                        </Button>
                                    </TableCell >

                                    <TableCell>

                                        <Button color={"secondary"}
                                                variant={"outlined"}
                                                component={Link}
                                                to={`/users/${user.id}/posts`}>
                                            Posts
                                        </Button>

                                    </TableCell>
                                    <TableCell>

                                        <Button color={"secondary"}
                                                variant={"outlined"}
                                                component={Link}
                                                to={`/users/${user.id}/albums`}>
                                            Albums
                                        </Button>

                                    </TableCell>
                                    <TableCell>

                                        <Button color={"secondary"}
                                                variant={"outlined"}
                                                component={Link}
                                                to={`/users/${user.id}/todos`}>
                                            To do
                                        </Button>

                                    </TableCell>

                                    <TableCell>

                                        <Button
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            color="error"
                                            variant="outlined"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Eliminar
                                        </Button>

                                    </TableCell>


                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </Container>
        </>
    )
}
export default Users;