import { useMutation } from "@tanstack/react-query";
import { fetchUser } from "../services/auth";

export function useLogin(){
    return useMutation({
        mutationFn: fetchUser 
    })
}