import { Button, Card, Container, SimpleGrid, Stack, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import ItemFormModal from "../../components/modals/ItemFormModal";
import { deleteItem } from "../../api/items.api";
import { sectionQueries } from "../../query/sections.query";
import { sectionsKey } from "../../query/sections.query";
import type { SectionItem } from "../../types/section.types";

export default function Section() {
  const { id } = useParams<{ id: string }>();
  const sectionId = id !== undefined && /^\d+$/.test(id) ? Number(id) : null;
  const query = useQuery({
    ...sectionQueries.all(sectionId ?? undefined),
    enabled: sectionId !== null,
  });
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteItem(sectionId ?? 0, itemId),
    onSuccess: () => {
      if (sectionId === null) return;
      void queryClient.invalidateQueries({ queryKey: sectionsKey.byId(sectionId) });
      notifications.show({
        title: "Item deleted",
        message: "The item was deleted successfully.",
        color: "green",
      });
    },
    onError: () => {
      notifications.show({
        title: "Unable to delete item",
        message: "Please try again.",
        color: "red",
      });
    },
  });
  const openItemForm = (item?: SectionItem) => {
    if (sectionId === null) return;
    modals.open({
      title: item ? "Edit item" : "Add item",
      children: <ItemFormModal sectionId={sectionId} item={item} />,
    });
  };

  if (sectionId === null) {
    return (
      <Container>
        <PageHeader title="SECTION" />
        <Text ta="center" c="red">
          This section URL is invalid.
        </Text>
      </Container>
    );
  }

  if (query.isLoading) {
    return (
      <Container>
        <PageHeader title="SECTION" />
        <Text ta="center">Loading section...</Text>
      </Container>
    );
  }

  if (query.isError) {
    return (
      <Container>
        <PageHeader title="SECTION" />
        <Stack align="center">
          <Text c="red">Unable to load this section.</Text>
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </Stack>
      </Container>
    );
  }

  const section = query.data?.data?.[0];
  if (!section) {
    return (
      <Container>
        <PageHeader title="SECTION" />
        <Text ta="center">Section not found.</Text>
      </Container>
    );
  }

  const items = section.items ?? [];

  return (
    <Container size="xl">
      <PageHeader
        title={section.title}
        action={
          <Button color="pink" radius="xl" onClick={() => openItemForm()}>
            Add item
          </Button>
        }
      />
      {items.length === 0 ? (
        <Text ta="center">This section has no items yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {items.map((item: SectionItem) => (
            <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={700}>{item.title}</Text>
              <Text c="dimmed" mt="sm">
                {item.description || "No description provided."}
              </Text>
              <Stack mt="md" gap="xs">
                <Button variant="light" onClick={() => openItemForm(item)}>
                  Edit
                </Button>
                <Button
                  color="red"
                  variant="light"
                  onClick={() =>
                    modals.openConfirmModal({
                      title: "Delete item",
                      children: <Text>Delete "{item.title}"?</Text>,
                      labels: { confirm: "Delete", cancel: "Cancel" },
                      confirmProps: { color: "red" },
                      onConfirm: () => deleteMutation.mutate(item.id),
                    })
                  }
                >
                  Delete
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
