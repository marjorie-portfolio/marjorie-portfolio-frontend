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

export async function editSection(sectionId: number, sectionName: string) {
  const body = new FormData();
  body.append("sectionName", sectionName);
  const response = await api.patch(`/section/edit-section/${sectionId}`, body);
  return response.data;
}

export async function deleteSection(sectionId: number) {
  const response = await api.delete(`/section/delete-section/${sectionId}`);
  return response.data;
}

export async function reorderSections(sectionIds: number[]) {
  const response = await api.patch("/section/edit-section-order", {
    sectionIds,
  });
  return response.data;
}
