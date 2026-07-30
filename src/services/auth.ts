import api from "./axios.ts"
import type { FetchUserRequest, FetchUserResponse } from "../types/auth.ts"

export async function fetchUser(reqBody: FetchUserRequest): Promise <FetchUserResponse> {

    const response = await api.post(`/auth/login`,reqBody)

   return response.data
}

export async function logout(){
 await api.post(`/auth/logout`)
}

export async function fetchCurrentUser(): Promise<FetchUserResponse> {
  const response = await api.get("/auth/currentUser");

  return response.data;
}