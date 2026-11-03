export interface CreateSectionReq {
    sectionName: string
}

 export interface CreateSectionRes {
   message: string;
   data: {
     section: {
       id: number;
       title: string;
       slug: string;
       display_order: number;
       is_visible: boolean;
       created_at: string;
       updated_at: string;
     };
   };
 }

 export type ItemType = "type_1" | "type_2" | "type_3";

 export interface SectionItem {
   id: number;
   sectionId: number;
   title: string;
   description: string | null;
   imageUrl: string | null;
   displayOrder: number | null;
   createdAt: string | null;
   updatedAt: string | null;
   imagePublicId: string | null;
   itemType: ItemType | null;
   expires_at: string | null;
   expiresAt?: string | null;
 }

 export interface Section {
   id: number;
   title: string;
   slug: string;
   cards: unknown[];
   items: SectionItem[];
    expires_at: string | null;
    expiresAt?: string | null;
 }

export interface SectionsResponse {
  data: Section[];
}
