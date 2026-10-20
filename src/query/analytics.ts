import { useQuery, useMutation, } from "@tanstack/react-query"

import {recordVisit} from "../api/analytics.ts"

export function useRecordVisit(){
    return useMutation({
       mutationFn: recordVisit
    })
}