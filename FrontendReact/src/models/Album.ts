import type { User } from "./User";

export interface Album {
    id: number;
    title: string;
    user?: User;
    photos?: Photo[];
}

export interface Photo {
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
    album?: Album;
}
