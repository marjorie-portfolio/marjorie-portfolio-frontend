import { mutationOptions } from "@tanstack/react-query";
import { createSection, deleteSection, editSection } from "../api/sections.api";
import type { CreateSectionReq } from "../types/section.types";

export const sectionMutations = {
  create: mutationOptions({
    mutationFn: (reqBody: CreateSectionReq) => createSection(reqBody),
  }),
  edit: (sectionId: number) => mutationOptions({
    mutationFn: (sectionName: string) => editSection(sectionId, sectionName),
  }),
  delete: (sectionId: number) => mutationOptions({
    mutationFn: () => deleteSection(sectionId),
  }),
};
