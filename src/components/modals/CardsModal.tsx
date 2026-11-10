import {
  ActionIcon,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPencilFilled, IconPlus, IconTrashFilled, IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cardMutations } from "../../mutations/cards.mutation";
import { updateCard } from "../../api/cards.api";
import { cardQueries, cardsKey } from "../../query/cards.query";
import type { Card } from "../../types/cards.types";
import { useTheme } from "../../context/ThemeContext";

type Props = { sectionId: number };

export default function CardsModal({ sectionId }: Props) {
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const query = useQuery(cardQueries.list(sectionId));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: cardsKey.list(sectionId) });
  };
  const save = useMutation({
    mutationFn: ({ cardId, description }: { cardId: number; description: string }) =>
      updateCard({ cardId }, { description }),
    onSuccess: async () => {
      await refresh();
      setEditingId(null);
      notifications.show({ title: "Card updated", message: "Your card was updated.", color: "primary" });
    },
    onError: () => notifications.show({ title: "Unable to update card", message: "Please try again.", color: "primary" }),
  });
  const add = useMutation({
    ...cardMutations.register(sectionId),
    onSuccess: async () => {
      await refresh();
      setNewDescription("");
      notifications.show({ title: "Card added", message: "Your card was added.", color: "primary" });
    },
    onError: () => notifications.show({ title: "Unable to add card", message: "Please try again.", color: "primary" }),
  });
  const remove = useMutation({
    ...cardMutations.delete(),
    onMutate: (variables) => {
      notifications.show({ title: "Card deleting", message: "Please Wait....", color: "primary" });
      console.log("Mutation started with:", variables);
    },
    onSuccess: async () => {
      await refresh();
      notifications.show({ title: "Card deleted", message: "The card was deleted.", color: "primary" });
    },
    onError: () => notifications.show({ title: "Unable to delete card", message: "Please try again.", color: "primary" }),
  });

  const cards = query.data?.data ?? [];
  const beginEdit = (card: Card) => {
    setEditingId(card.id);
    setDraft(card.description ?? "");
  };
  const confirmDelete = (card: Card) => {
    modals.openConfirmModal({
      title: "Delete card",
      children: <Text>Are you sure you want to delete this card?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "primary" },
      onConfirm: () => remove.mutate({ cardIds: [card.id] }),
    });
  };

  return (
    <Stack gap="xs">
      {query.isPending && <Loader mx="auto" />}
      {query.isError && <Text c="red">Unable to load cards.</Text>}
      {!query.isPending && !query.isError && cards.map((card) => (
        <Group key={card.id} gap="xs" wrap="nowrap" align="flex-end">
          {editingId === card.id ? (
            <TextInput
              aria-label="Card description"
              value={draft}
              onChange={(event) => setDraft(event.currentTarget.value)}
              style={{ flex: 1 }}
              autoFocus
            />
          ) : (
            <Text c={colors.text} style={{ flex: 1, borderBottom: `1px solid ${colors.textDimmed}`, padding: "4px 0" }}>
              <span style={{ color: colors.accPrimary }}>• </span>{card.description}
            </Text>
          )}
          {editingId === card.id ? (
            <ActionIcon aria-label="Save card" variant="subtle" onClick={() => save.mutate({ cardId: card.id, description: draft.trim() })} disabled={!draft.trim() || save.isPending}>
              <IconCheck size={17} />
            </ActionIcon>
          ) : (
            <ActionIcon aria-label="Edit card" variant="subtle" onClick={() => beginEdit(card)}>
              <IconPencilFilled size={17} color={colors.accPrimary}/>
            </ActionIcon>
          )}
          <ActionIcon aria-label="Delete card" variant="subtle" onClick={() => confirmDelete(card)} disabled={remove.isPending}>
            <IconTrashFilled size={17} color={colors.accPrimary}/>
          </ActionIcon>
        </Group>
      ))}
      <Group gap="xs" wrap="nowrap" align="flex-end">
        <TextInput
          aria-label="New card description"
          placeholder="Add a card"
          value={newDescription}
          onChange={(event) => setNewDescription(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && newDescription.trim()) add.mutate({ descriptions: [newDescription.trim()] });
          }}
          style={{ flex: 1 }}
        />
        <ActionIcon
          aria-label="Add card"
          size="lg"
          radius="xl"
          color={colors.accPrimary}
          onClick={() => add.mutate({ descriptions: [newDescription.trim()] })}
          disabled={!newDescription.trim()}
        >
           {add.isPending ? (
    <Loader color="white" size={18} />
  ) : (
    <IconPlus color="white" size={20} />
  )}
        </ActionIcon>
      </Group>
    </Stack>
  );
}
