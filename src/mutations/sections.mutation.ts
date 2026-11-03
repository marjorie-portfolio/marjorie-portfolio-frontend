import { mutationOptions } from "@tanstack/react-query";
import { createSection } from "../api/sections.api";
import type { CreateSectionReq } from "../types/section.types";

export const sectionMutations = {
  create: mutationOptions({
    mutationFn: (reqBody: CreateSectionReq) => createSection(reqBody),
  }),
};
