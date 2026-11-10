import { Button, Stack, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

import { acitvityLogsKey } from "../../../query/acitvity-logs.query";
import { sectionsKey } from "../../../query/sections.query";
import { sectionMutations } from "../../../mutations/sections.mutation";
import type { Section } from "../../../types/section.types";

export default function EditSectionModal({ section }: { section: Section }) {
  const { colors } = useTheme();
  const [name, setName] = useState(section.title);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...sectionMutations.edit(section.id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: sectionsKey.all }),
        queryClient.invalidateQueries({
          queryKey: sectionsKey.byId(section.id),
        }),
        queryClient.refetchQueries({
          queryKey: acitvityLogsKey.all,
          type: "active",
        }),
      ]);
      notifications.show({
        title: "Section renamed",
        message: "The section name was updated.",
        color: "primary",
      });
      modals.closeAll();
    },
    onError: (cause) => {
      const message =
        cause instanceof Error && cause.message.includes("already exists")
          ? "A section with this name already exists."
          : "Unable to rename this section.";
      setError(message);
      notifications.show({
        title: "Unable to rename section",
        message,
        color: "primary",
      });
    },
  });

  const save = () => {
    const value = name.trim();
    if (!value) return setError("Section name is required.");
    if (value.length > 50)
      return setError("Section name must be 50 characters or fewer.");
    mutation.mutate(value);
  };

  return (
    <Stack gap="xl" mt="md">
      <TextInput
        label="SECTION NAME"
        value={name}
        onChange={(event) => {
          setName(event.currentTarget.value);
          setError(null);
        }}
        error={error}
        styles={{
          label: {
            color: colors.text,
          },
        }}
      />
      <Button
        fullWidth
        loading={mutation.isPending}
        disabled={name.trim() === section.title}
        onClick={save}
      >
        SAVE
      </Button>
    </Stack>
  );
}
