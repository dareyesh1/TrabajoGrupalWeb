import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import AlbumIcon from '@mui/icons-material/Album';
import ImageIcon from '@mui/icons-material/Image';
import ChecklistIcon from '@mui/icons-material/Checklist';
import { Link } from "react-router-dom";

function NavBar(){

    return(
        <AppBar position="static" sx={{ backgroundColor: 'green' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Frontend React
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto' }}>
                    <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Inicio
                    </Button>
                    <Button color="inherit" component={Link} to="/users" startIcon={<PeopleIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Usuarios
                    </Button>
                    <Button color="inherit" component={Link} to="/posts" startIcon={<ArticleIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Posts
                    </Button>
                    <Button color="inherit" component={Link} to="/comments" startIcon={<ChatIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Comentarios
                    </Button>
                    <Button color="inherit" component={Link} to="/albums" startIcon={<AlbumIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Álbumes
                    </Button>
                    <Button color="inherit" component={Link} to="/photos" startIcon={<ImageIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Fotos
                    </Button>
                    <Button color="inherit" component={Link} to="/todos" startIcon={<ChecklistIcon/>} sx={{ whiteSpace: 'nowrap' }}>
                        Tareas
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )

}
export default NavBar