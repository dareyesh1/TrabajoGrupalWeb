import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, CardContent, TextField, Typography} from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions'; // Corregido de CardActionArea a CardActions
import type { Album } from "../../models/Album";

function AlbumDetail() {

    const url = "/api/albums";
    const {id} = useParams<{id: string}>();

    // Estado inicial en lugar de null para evitar errores de renderizado
    const [album, setAlbum] = useState<Album>({id: 0, title: ""});

    useEffect(() => {
        axios.get<Album>(`${url}/${id}`)
            .then(response => setAlbum(response.data))
            .catch(error => alert("Error: " + error));
    }, [id]);

    //Album Guardar
    const handleGuardar = () => {
        axios.put<Album>(`${url}/${id}`, album)
            .then(response => {
                //Hacer algo con el album
                setAlbum(response.data);
                alert("Álbum actualizado");
            })
            .catch(error => alert("Error: " + error));
    };

    return (
        <>
            {/*<Button variant="contained" component={Link} to={`/albums`}>*/}
            {/*    Regresar*/}
            {/*</Button>*/}

            <Box sx={{maxWidth: "600", margin: "20px auto", px: 2}}>
                <Card variant={"outlined"} sx={{borderRadius: 3}}>
                    <CardContent sx={{display: "flex", flexDirection: "column", gap: 2}}>

                        <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <Typography variant="h6" component="h2" sx={{fontWeight: "bold"}}>
                                Editar Álbum
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{fontWeight: "bold"}}>
                                <b>ID: {album.id}</b>
                            </Typography>
                        </Box>

                        <TextField
                            label={"Título del álbum"}
                            variant="outlined"
                            value={album.title}
                            fullWidth
                            onChange={e => setAlbum({...album, title: e.target.value})}
                        />

                    </CardContent>

                    <CardActions sx={{justifyContent: "flex-end", px: 4, pb: 4, gap: 1}}>

                        <Button variant="contained" color="primary" size="large" onClick={handleGuardar}>
                            Guardar
                        </Button>

                        <Button variant="outlined"
                                color="inherit"
                                size="large"
                                component={Link}
                                to={`/albums`}
                        >
                            Regresar
                        </Button>

                        <Button
                            variant={"contained"}
                            color={"secondary"}
                            size={"large"}
                            component={Link}
                            to={`/albums/${album.id}/photos`}
                            sx={{
                                borderRadius: 3,
                                px: 4,
                                fontWeight: "bold"
                            }}
                        >
                            Ver Fotos
                        </Button>

                    </CardActions>
                </Card>

            </Box>

        </>
    )
}

export default AlbumDetail;