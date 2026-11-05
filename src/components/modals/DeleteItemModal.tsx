import { Button, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { itemMutations } from "../../mutations/items.mutation";
import { sectionsKey } from "../../query/sections.query";
import type { SectionItem } from "../../types/section.types";

type Props = { sectionId: number; item: SectionItem };

export default function DeleteItemModal({ sectionId, item }: Props) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...itemMutations.delete(sectionId, item.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sectionsKey.byId(sectionId),
      });
      notifications.show({
        title: "Item deleted",
        message: "The item was deleted successfully.",
        color: "primary",
      });
      modals.closeAll();
    },
    onError: () =>
      notifications.show({
        title: "Unable to delete item",
        message: "Please try again.",
        color: "primary",
      }),
  });

  return (
    <Stack gap="lg">
      <Text>Are you sure you want to delete this item "{item.title}"?</Text>
      <Group justify="flex-end">
        <Button
          variant="default"
          disabled={mutation.isPending}
          onClick={() => modals.closeAll()}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          loading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          Delete
        </Button>
      </Group>
    </Stack>
  );
}
