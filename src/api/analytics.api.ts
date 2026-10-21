import api from "../services/axios.ts"

export async function recordVisit(){
    return await api.post(`/analytics/record-visits`)
}

export async function fetchVisits(){
    return await api.get("/analytics/visits")
}