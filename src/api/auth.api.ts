import api from "../services/axios.ts";
import type { FetchUserRequest, FetchUserResponse } from "../types/auth.types.ts";

export async function fetchUser(
  reqBody: FetchUserRequest,
): Promise<FetchUserResponse> {
  const response = await api.post(`/auth/login`, reqBody);
  return response.data;
}

export async function fetchCurrentUser(): Promise<FetchUserResponse> {
  const response = await api.get("/auth/currentUser");

  return response.data;
}

export async function logout() {
  await api.post(`/auth/logout`);
}
