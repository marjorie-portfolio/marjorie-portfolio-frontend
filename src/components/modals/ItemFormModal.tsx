import { Button, Stack, TextInput, Textarea } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { itemMutations } from "../../mutations/items.mutation";
import { sectionsKey } from "../../query/sections.query";
import type { SectionItem } from "../../types/section.types";

type ItemFormModalProps = {
  sectionId: number;
  item?: SectionItem;
};

export default function ItemFormModal({ sectionId, item }: ItemFormModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    ...(item
      ? itemMutations.update(sectionId, item.id)
      : itemMutations.create(sectionId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: sectionsKey.byId(sectionId) });
      notifications.show({
        title: item ? "Item updated" : "Item created",
        message: item
          ? "The item was updated successfully."
          : "The item was added successfully.",
        color: "green",
      });
      modals.closeAll();
    },
    onError: () => {
      notifications.show({
        title: item ? "Unable to update item" : "Unable to create item",
        message: "Please try again.",
        color: "red",
      });
    },
  });

  return (
    <Stack>
      <TextInput
        label="Title"
        value={title}
        error={error}
        onChange={(event) => {
          setTitle(event.currentTarget.value);
          if (error) setError(null);
        }}
        required
      />
      <Textarea
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.currentTarget.value)}
        autosize
        minRows={3}
      />
      <Button
        loading={mutation.isPending}
        onClick={() => {
          const trimmedTitle = title.trim();
          if (!trimmedTitle) {
            setError("Title is required.");
            return;
          }
          mutation.mutate({
            title: trimmedTitle,
            description: description.trim(),
          });
        }}
      >
        {item ? "Save changes" : "Add item"}
      </Button>
    </Stack>
  );
}
