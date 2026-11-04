import { Box, Card, Group, Stack, Text, Typography } from "@mantine/core";
import DOMPurify from "dompurify";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ItemType, SectionItem } from "../../types/section.types";
import ImageFrame from "./ImageFrame";
import ExpiryTimer from "../ExpiryTimer";
import { getExpiresAt } from "../../utils/content";

type ItemRendererProps = {
  item: SectionItem;
  onEdit: () => void;
  onDelete: () => void;
};

function getItemType(item: SectionItem): ItemType {
  if (item.itemType) return item.itemType;
  if (item.imageUrl && item.title && item.description) return "type_3";
  if (item.imageUrl && item.title) return "type_2";
  return "type_1";
}

function Description({ value }: { value: string | null }) {
  if (!value) return null;
  return (
    <Typography
      style={{ overflowWrap: "anywhere", wordBreak: "break-word", maxWidth: "100%" }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
    />
  );
}

export default function ItemRenderer({ item, onEdit, onDelete }: ItemRendererProps) {
  const type = getItemType(item);
  const mobile = useMediaQuery("(max-width: 600px)");
  const expiresAt = getExpiresAt(item);
  const actions = (
    <Group gap={4} justify="flex-end">
      <ActionIcon size="sm" variant="subtle" aria-label="Edit item" onClick={onEdit}>
        <IconPencil size={15} />
      </ActionIcon>
      <ActionIcon size="sm" variant="subtle" aria-label="Delete item" onClick={onDelete}>
        <IconTrash size={15} />
      </ActionIcon>
    </Group>
  );

  if (type === "type_2") {
    return (
      <Card pos="relative" withBorder>
        <Group justify="space-between">{expiresAt && <ExpiryTimer expiresAt={expiresAt} />}{actions}</Group>
        <Stack align="center">
          <ImageFrame src={item.imageUrl} ratio={16 / 9} />
          <Text fw={700} ta="center">{item.title}</Text>
        </Stack>
      </Card>
    );
  }
  if (type === "type_3") {
    return (
      <Card withBorder>
        <Group justify="space-between">{expiresAt && <ExpiryTimer expiresAt={expiresAt} />}{actions}</Group>
        <Box display="flex" style={{ gap: "var(--mantine-spacing-lg)", alignItems: "center", flexDirection: mobile ? "column" : "row" }}>
          <Box style={{ flex: "0 0 34%" }}><ImageFrame src={item.imageUrl} ratio={3 / 4} /></Box>
          <Stack style={{ flex: 1, minWidth: 0 }}><Text fw={700} style={{ overflowWrap: "anywhere" }}>{item.title}</Text><Description value={item.description} /></Stack>
        </Box>
      </Card>
    );
  }
  return (
    <Card withBorder>
      <Group justify="space-between">{expiresAt && <ExpiryTimer expiresAt={expiresAt} />}{actions}</Group>
      <Stack align="center">
        <Text fw={700} ta="center">{item.title}</Text>
        <Description value={item.description} />
      </Stack>
    </Card>
  );
}
