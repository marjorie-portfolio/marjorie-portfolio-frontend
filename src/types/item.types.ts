import type { SectionItem } from "./section.types";

export interface ItemFormValues {
  title: string;
  description: string;
}

export interface ItemMutationResponse {
  message: string;
  data: {
    item?: SectionItem;
    updated?: SectionItem;
  };
}
