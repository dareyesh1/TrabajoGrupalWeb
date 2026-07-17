

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import User from "./pages/User.tsx";
import Posts from "./pages/Posts.tsx";
import Comments from "./pages/Comments.tsx";
import Albums from "./pages/Albums.tsx";
import Photos from "./pages/Photos.tsx";
import Todos from "./pages/Todos.tsx";
import { createTheme, ThemeProvider } from '@mui/material';
import UserDetail from "./pages/editar/UserDetail.tsx";
import PostsDetail from "./pages/editar/PostsDetail.tsx";
import AddUser from "./pages/agregar/AddUser.tsx";
import AddComment from "./pages/agregar/AddComment.tsx";
import AddPost from "./pages/agregar/AddPost.tsx";
import AddAlbum from "./pages/agregar/AddAlbums.tsx";
import AlbumDetail from "./pages/editar/AlbumDetail.tsx";
import TodoDetail from "./pages/editar/TodoDetail.tsx";
import AddTodo from "./pages/agregar/AddTodo.tsx";
import CommentDetail from "./pages/editar/CommentDetail.tsx";
import AddPhotos from "./pages/agregar/AddPhotos.tsx";
import PhotoDetail  from "./pages/editar/PhotoDetail.tsx";
const darkTheme= createTheme({
    palette: {
        mode: 'light',
    },
});

function App() {

  return (
    <>
        <ThemeProvider theme={darkTheme}>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/users" element={<User/>} />
                <Route path="/users/:id" element={<UserDetail/>} />
                <Route path="/users/new" element={<AddUser/>} />



                <Route path="/posts" element={<Posts/>} />
                <Route path="/posts/:id" element={<PostsDetail/>} />
                <Route path="/users/:userId/posts" element={<Posts/>} />
                <Route path="/posts/:userId/new" element={<AddPost/>} />



                <Route path="/comments" element={<Comments/>} />
                <Route path="/comments/:id" element={<CommentDetail/>} />
                <Route path="/posts/:postId/comments" element={<Comments/>} />
                <Route path="/comments/:postId/new" element={<AddComment/>} />


                <Route path="/albums" element={<Albums/>} />
                <Route path="/albums/:userId/new" element={<AddAlbum/>} />
                <Route path="/users/:userId/albums" element={<Albums/>} />
                <Route path="/albums/:id" element={<AlbumDetail/>} />


                <Route path="/photos" element={<Photos/>} />
                <Route path="/photos/:albumId/new" element={<AddPhotos/>} />
                <Route path="/albums/:albumId/photos" element={<Photos/>} />
                <Route path="/photos/:id" element={<PhotoDetail/>} />


                <Route path="/todos" element={<Todos/>} />
                <Route path="/todos/:userId/new" element={<AddTodo/>} />
                <Route path="/users/:userId/todos" element={<Todos/>} />
                <Route path="/todos/:id" element={<TodoDetail/>} />



            </Routes>
        </ThemeProvider>

    </>
  )
}

export default App
