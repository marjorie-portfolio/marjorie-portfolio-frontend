import { useQuery, useMutation, } from "@tanstack/react-query"

import {recordVisit, fetchVisits} from "../api/analytics.api.ts"

export function useRecordVisit(){
    return useMutation({
       mutationFn: recordVisit
    })
}

export function useVisits(){
return useQuery({
    queryKey: ["visits"],
    queryFn: fetchVisits
})
} 
