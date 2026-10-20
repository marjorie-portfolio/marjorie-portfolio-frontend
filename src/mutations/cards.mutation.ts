import { mutationOptions } from "@tanstack/react-query";
import { registerCards, updateCard, deleteCard } from "../api/cards.api";
import type {
  RegisterCardsRequest,
  DeleteCardsRequest,
} from "../types/cards.types";

export const cardMutations = {
  register: (sectionId: number) =>
    mutationOptions({
      mutationFn: (reqBody: RegisterCardsRequest) =>
        registerCards({ sectionId }, reqBody),
    }),

  update: (cardId: number) =>
    mutationOptions({
      mutationFn: () => updateCard({ cardId }),
    }),

  delete: () =>
    mutationOptions({
      mutationFn: (reqBody: DeleteCardsRequest) => deleteCard(reqBody),
    }),
};
