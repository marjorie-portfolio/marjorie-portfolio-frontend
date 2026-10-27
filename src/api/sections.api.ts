import api from "../services/axios";
import type {
  CreateSectionReq,
  CreateSectionRes,
} from "../types/section.types";

export async function fetchSections() {
  const response = await api.get("/section");
  return response.data;
}

export async function createSection(
  reqbody: CreateSectionReq,
): Promise<CreateSectionRes> {
  const response = await api.get("/section/register-section", reqbody);
  return response.data
}
