import type {QueryOptions} from "@tanstack/react-query";
import {fetchSections} from "../services/sections.ts";

export const sectionsKey ={
    all: ["sections"] as const,
}

export const sectionQueries = {
    all: () => ({
        queryKey: sectionsKey.all,
        queryFn: fetchSections,
    })
}