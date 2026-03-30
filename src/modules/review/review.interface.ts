
export interface IReview {
    mediaId: string;
    rating: number;
    content: string;
    tags?: string[];
    isSpoiler?: boolean;
}

export interface IUpdateReview {
    rating?: number;
    content?: string;
    tags?: string[];
    isSpoiler?: boolean;
}