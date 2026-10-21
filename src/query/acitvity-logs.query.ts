import {queryOptions} from "@tanstack/react-query";
import {fetchActivityLogs} from "../api/activity-logs.api"

export const acitvityLogsKey ={
    all: ["acitvity-logs"] as const,
}

export const acitvityLogsQueries = {
    all: () => queryOptions({
        queryKey: acitvityLogsKey.all,
        queryFn: fetchActivityLogs,
    })
}