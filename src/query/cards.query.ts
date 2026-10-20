import { queryOptions } from "@tanstack/react-query";
import { fetchCards } from "../api/cards.api";

export const cardsKey = {
    all: ["cards"] as const,
    lists: () => [...cardsKey.all, "list"] as const,
    list: (sectionId: number | undefined) => [...cardsKey.lists(), sectionId] as const,
};

export const cardQueries = {
    all: (sectionId?: number) => 
        queryOptions({
            queryKey: cardsKey.all,
            queryFn: () => fetchCards({ sectionId }),
        }),
        
    list: (sectionId?: number) => 
        queryOptions({
            queryKey: cardsKey.list(sectionId),
            queryFn: () => fetchCards({ sectionId }),
        }),
};