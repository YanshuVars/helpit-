export interface Post {
    id: string;
    ngo_id: string;
    author_id: string;
    title: string;
    content: string;
    post_type: string;
    media_urls: string[];
    likes_count: number;
    comments_count: number;
    visibility: string;
    published_at: string | null;
    created_at: string;
    author?: {
        full_name: string;
        avatar_url: string | null;
    };
    is_liked?: boolean;
}

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    user?: {
        full_name: string;
        avatar_url: string | null;
    };
}
