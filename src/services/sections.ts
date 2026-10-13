import api from "./axios.ts";

export async function fetchSections() {
    const response = await api.get("/section");
    return response.data;
}