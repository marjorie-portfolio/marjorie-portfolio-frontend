import { Button, Group, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../../context/ThemeContext";

import { deleteSection } from "../../../api/sections.api";
import { acitvityLogsKey } from "../../../query/acitvity-logs.query";
import { sectionsKey } from "../../../query/sections.query";
import type { Section } from "../../../types/section.types";

export default function DeleteSectionModal({ section }: { section: Section }) {
  const {colors} = useTheme()
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteSection(section.id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sectionsKey.all }),
        queryClient.refetchQueries({ queryKey: acitvityLogsKey.all, type: "active" }),
      ]);
      notifications.show({
        title: "Section deleted",
        message: "The section and its content were deleted.",
        color: "primary",
      });
      modals.closeAll();
    },
    onError: () =>
      notifications.show({
        title: "Unable to delete section",
        message: "Please try again.",
        color: "primary",
      }),
  });

  return (
    <Stack gap="lg">
      <Text c={colors.text}>
        Delete "{section.title}"? All of its items and cards will also be
        deleted. This cannot be undone.
      </Text>
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
