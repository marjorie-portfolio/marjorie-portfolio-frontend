import { mutationOptions } from "@tanstack/react-query";
import { createItem, deleteItem, updateItem } from "../api/items.api";
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
};
