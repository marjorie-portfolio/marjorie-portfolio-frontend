import api from "../services/axios";
import type {
  CreateSectionReq,
  CreateSectionRes,
  SectionsResponse
} from "../types/section.types";

export async function fetchSections(id?: number): Promise<SectionsResponse> {
  const response = await api.get<SectionsResponse>("/section", {
    params: { sectionId:id }
  });
  return response.data;
}

export async function createSection(
  reqbody: CreateSectionReq,
): Promise<CreateSectionRes> {
  const response = await api.post("/section/register-section", reqbody);
  return response.data
}
