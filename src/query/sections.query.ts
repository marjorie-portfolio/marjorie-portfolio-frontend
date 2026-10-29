import { queryOptions } from "@tanstack/react-query";
import { fetchSections } from "../api/sections.api";

export const sectionsKey = {
  all: ["sections"] as const,
  byId: (id: number) => [...sectionsKey.all, id] as const,
};

export const sectionQueries = {
  all: (id: number) =>
    queryOptions({
      queryKey: sectionsKey.byId(id),
      queryFn: () => fetchSections(id),
    
    }),
};