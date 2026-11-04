export interface Card {
    id: number;
    description: string | null;
    display_order: number | null;
    created_at: string | null;
    updated_at: string | null;
    sectionId: number | null;
}

export interface CardsResponse {
    data: Card[];
}

export interface DeleteCardsRequest {
    cardIds: number[];
}

export interface RegisterCardsRequest {
    descriptions: string[];
}

export interface UpdateCardRequest {
    description: string | null;
}