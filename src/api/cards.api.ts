import api from "../services/axios";
import type {
    CardsResponse,
    DeleteCardsRequest,
    RegisterCardsRequest,
    UpdateCardRequest,
} from "../types/cards.types";

interface Parameters {
    sectionId?: number ,
    cardId?: number,
}

export async function fetchCards({sectionId}: Parameters): Promise<CardsResponse> {
    const response = await api.get(`/cards/${sectionId}`)
    return response.data
}

export async function registerCards({sectionId}: Parameters, reqBody: RegisterCardsRequest) {
    const response =  await api.post(`/cards/register-cards/${sectionId}`, reqBody)
    return response
}

export async function updateCard({cardId}: Parameters, reqBody: UpdateCardRequest){
    const response = await api.patch(`/cards/update-card/${cardId}`, reqBody)
    return response.data
}

export async function deleteCard(reqBody: DeleteCardsRequest): Promise<unknown>{
    const response = await api.delete(`/cards/delete-cards/`, {data: reqBody})
    return response.data
}