import type { ItemType, SectionItem } from "./section.types";

export interface ItemFormValues {
  title: string;
  description: string;
  image?: File;
  itemType: ItemType;
}

export interface ItemMutationResponse {
  message: string;
  data: {
    item?: SectionItem;
    updated?: SectionItem;
  };
}
