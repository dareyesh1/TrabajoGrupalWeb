import type { User } from "./User";

export interface Post {
    id: number;
    title: string;
    body: string;
    user?: User;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    name: string;
    email: string;
    body: string;
    post?: Post;
}
