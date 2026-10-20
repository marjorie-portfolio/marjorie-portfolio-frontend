import {queryOptions} from "@tanstack/react-query";
import {fetchSections} from "../api/sections.api.ts";

export const sectionsKey ={
    all: ["sections"] as const,
}

export const sectionQueries = {
    all: () => queryOptions({
        queryKey: sectionsKey.all,
        queryFn: fetchSections,
    })
}