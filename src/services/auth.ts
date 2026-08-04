import api from "./axios.ts";
import type { FetchUserRequest, FetchUserResponse } from "../types/auth.ts";

export async function fetchUser(
  reqBody: FetchUserRequest,
): Promise<FetchUserResponse> {
  return await api.post(`/auth/login`, reqBody);
}

export async function fetchCurrentUser(): Promise<FetchUserResponse> {
  const response = await api.get("/auth/currentUser");

  return response.data;
}

export async function logout() {
  await api.post(`/auth/logout`);
}
