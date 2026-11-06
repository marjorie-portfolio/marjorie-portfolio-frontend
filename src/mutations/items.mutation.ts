import { mutationOptions } from "@tanstack/react-query";
import {
  createItem,
  deleteItem,
  reorderItems,
  updateItem,
} from "../api/items.api";
import type { ItemFormValues } from "../types/item.types";

export const itemMutations = {
  create: (sectionId: number) =>
    mutationOptions({
      mutationFn: (values: ItemFormValues) => createItem(sectionId, values),
    }),
  update: (sectionId: number, itemId: number) =>
    mutationOptions({
      mutationFn: (values: ItemFormValues) =>
        updateItem(sectionId, itemId, values),
    }),
  delete: (sectionId: number, itemId: number) =>
    mutationOptions({
      mutationFn: () => deleteItem(sectionId, itemId),
    }),
  reorder: (sectionId: number) =>
    mutationOptions({
      mutationFn: (itemIds: number[]) => reorderItems(sectionId, itemIds),
    }),
};
