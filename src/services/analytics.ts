import api from "./axios.ts"

export async function recordVisit(){
    return await api.post(`/analytics/recordVisits`)
}