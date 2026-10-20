import api from "../services/axios";
import type { DeleteCardsRequest, RegisterCardsRequest } from "../types/cards.types";

interface Parameters {
    sectionId?: number ,
    cardId?: number,
}

export async function fetchCards({sectionId}:Parameters) : Promise<any> {
    const response = await api.get(`/cards/${sectionId}`)
    return response.data
}

export async function registerCards({sectionId}: Parameters, reqBody: RegisterCardsRequest) {
    const response =  await api.post(`/register-cards/${sectionId}`, reqBody)
    return response
}

export async function updateCard({cardId}: Parameters){
    const response = await api.patch(`/update-card/${cardId}`)
    return response
}

export async function deleteCard(reqBody: DeleteCardsRequest):Promise<any>{
    const response = await api.delete(`/delete-card/`, {data: reqBody})
    return response
}