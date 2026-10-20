import api from "../services/axios";

export async function fetchSections() {
    const response = await api.get("/section");
    return response.data;
}