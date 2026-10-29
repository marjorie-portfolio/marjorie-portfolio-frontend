export interface CreateSectionReq {
    sectionName: string
}

 export interface CreateSectionRes {
id: number;
  title: string;
  slug: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  title: string;
  slug: string;
  cards: unknown[];
  items: unknown[];
}
