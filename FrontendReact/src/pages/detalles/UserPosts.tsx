import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import type { Post } from "../models/Post";

import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Box
} from "@mui/material";

function UserPosts() {

    const { id } = useParams<{ id: string }>();

    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {

        axios
            .get<Post[]>(
                `https://jsonplaceholder.typicode.com/posts?userId=${id}`
            )
            .then(response => setPosts(response.data))
            .catch(error => alert("Error: " + error));

    }, [id]);

    return (

        <Container sx={{ mt: 4 }}>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                }}
            >

                <Typography variant="h4">
                    Posts del Usuario {id}
                </Typography>

                <Button
                    variant="outlined"
                    component={Link}
                    to="/users"
                >
                    Regresar
                </Button>

            </Box>

            {
                posts.map(post => (

                    <Card
                        key={post.id}
                        sx={{ mb: 2 }}
                    >

                        <CardContent>

                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold" }}
                            >
                                {post.title}
                            </Typography>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                            >
                                {post.body}
                            </Typography>

                        </CardContent>

                    </Card>
                ))
            }

        </Container>
    );
}

export default UserPosts;