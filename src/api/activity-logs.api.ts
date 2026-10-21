import api from "../services/axios";

import type {ActivityLogGroup} from  "../types/activity-logs.types"

export async function fetchActivityLogs():Promise<ActivityLogGroup[]>{
    const response = await api.get(`/activity-logs`)
    return response.data
}