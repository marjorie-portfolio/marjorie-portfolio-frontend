import api from "../services/axios";
import type { ItemMutationResponse, ItemFormValues } from "../types/item.types";

function toFormData(values: ItemFormValues) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("itemType", values.itemType);
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }
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

export async function reorderItems(
  sectionId: number,
  itemIds: number[],
): Promise<unknown> {
  const response = await api.patch(
    `/item/${sectionId}/items/reorder`,
    {itemIds},
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