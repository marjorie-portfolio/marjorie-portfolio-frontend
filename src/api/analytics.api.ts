import api from "../services/axios.ts"

export async function recordVisit(){
    return await api.post(`/analytics/recordVisits`)
}