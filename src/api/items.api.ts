import api from "../services/axios";
import type { ItemMutationResponse, ItemFormValues } from "../types/item.types";

function toFormData(values: ItemFormValues) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  return formData;
}

export async function createItem(
  sectionId: number,
  values: ItemFormValues,
): Promise<ItemMutationResponse> {
  const response = await api.post(`/item/${sectionId}/items`, toFormData(values));
  return response.data;
}

export async function updateItem(
  sectionId: number,
  itemId: number,
  values: ItemFormValues,
): Promise<ItemMutationResponse> {
  const response = await api.patch(
    `/item/${sectionId}/items/${itemId}`,
    toFormData(values),
  );
  return response.data;
}

export async function deleteItem(
  sectionId: number,
  itemId: number,
): Promise<ItemMutationResponse> {
  const response = await api.delete(`/item/${sectionId}/items/${itemId}`);
  return response.data;
}