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

 export interface SectionItem {
   id: number;
   title: string;
   description: string | null;
   image: string | null;
   sectionId: number;
 }

 export interface Section {
   id: number;
   title: string;
   slug: string;
   cards: unknown[];
   items: SectionItem[];
 }

export interface SectionsResponse {
  data: Section[];
}
