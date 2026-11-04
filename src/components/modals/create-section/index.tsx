import { Button, Text, Box, Stack, TextInput } from "@mantine/core";
import { modals } from '@mantine/modals';
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sectionMutations } from "../../../mutations/sections.mutation";
import { sectionsKey } from "../../../query/sections.query";
import { rememberSectionExpiry } from "../../../utils/content";

function CreateSectionForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createMutation = useMutation({
    ...sectionMutations.create,
    onSuccess: (response) => {
      rememberSectionExpiry(
        response.data.section.id,
        response.data.section.expires_at,
      );
      void queryClient.invalidateQueries({ queryKey: sectionsKey.all });
      modals.closeAll();
      navigate(`/section/${response.data.section.id}`);
    },
    onError: () => {
      notifications.show({
        title: "Unable to create section",
        message: "Please try again.",
        color: "primary",
      });
    },
  });

  return (
    <Stack gap="xl" mt="md">
      <TextInput
        value={name}
        onChange={(event) => {
          setName(event.currentTarget.value);
          if (error) setError(null);
        }}
        error={error}
        label={
          <Text fw={800} size="xs" style={{ letterSpacing: "0.5px" }}>
            SECTION NAME:
          </Text>
        }
        placeholder="e.g About me, Skills, Journey"
        radius="xl"
        size="md"
      />
      <Button
        fullWidth
        radius="xl"
        size="md"
        color="pink"
        loading={createMutation.isPending}
        onClick={() => {
          const trimmedName = name.trim();
          if (!trimmedName) {
            setError("Section name is required.");
            return;
          }
          if (trimmedName.length > 50) {
            setError("Section name must be 50 characters or fewer.");
            return;
          }
          createMutation.mutate({ sectionName: trimmedName });
        }}
        style={{
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: 700,
        }}
      >
        CONTINUE
      </Button>
    </Stack>
  );
}

export default function CreateSectionModals() {
  const nameModal = () => {
    modals.open({
      title: (
        <Box style={{ textAlign: 'center', width: '100%' }}>
          <Text fw={900} size="lg" style={{ letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            CREATE SECTION
          </Text>
          <Text size="xs" c="dimmed">
            Set name for the section
          </Text>
        </Box>
      ),
      centered: true,
      radius: 'lg',
      padding: 'md',
      children: <CreateSectionForm />,
    });
  };


  return { nameModal };
}