import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUser, fetchCurrentUser, logout} from "../services/auth";
import type { FetchUserRequest, FetchUserResponse } from "../types/auth";

export function useLogin(){
    return useMutation<FetchUserResponse, Error, FetchUserRequest>({
        mutationFn: fetchUser 
    })
}

export function useCurrentUser(){
    return useQuery({
        queryKey: ["current-user"],
        queryFn: fetchCurrentUser,
        retry: false
    })
}

export function useLogout(){
    return useMutation({
        mutationFn: logout
    })
}