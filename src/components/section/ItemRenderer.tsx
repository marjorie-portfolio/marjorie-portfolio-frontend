import { Box, Card, Group, Stack, Text, Typography } from "@mantine/core";
import DOMPurify from "dompurify";
import { IconPencilFilled, IconTrashFilled } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { ItemType, SectionItem } from "../../types/section.types";
import ImageFrame from "./ImageFrame";
import ExpiryTimer from "../ExpiryTimer";
import { getExpiresAt } from "../../utils/content";
import { useTheme } from "../../context/ThemeContext";

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
      style={{
        overflowWrap: "anywhere",
        wordBreak: "break-word",
        maxWidth: "100%",
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
    />
  );
}

export default function ItemRenderer({
  item,
  onEdit,
  onDelete,
}: ItemRendererProps) {
  const type = getItemType(item);
  const mobile = useMediaQuery("(max-width: 600px)");
  const expiresAt = getExpiresAt(item);

  const { colors } = useTheme();

  const actions = (
    <Group gap={4}>
      <ActionIcon
        size="sm"
        variant="subtle"
        aria-label="Edit item"
        onClick={onEdit}
      >
        <IconPencilFilled size={15} color={colors.accPrimary}/>
      </ActionIcon>
      <ActionIcon
        size="sm"
        variant="subtle"
        aria-label="Delete item"
        onClick={onDelete}
      >
        <IconTrashFilled size={15} color={colors.accPrimary}/>
      </ActionIcon>
    </Group>
  );

  if (type === "type_2") {
    return (
      <Card
        pos="relative"
        withBorder
        bd={`2px solid ${colors.accPrimary}`}
        bg={colors.bgBase}
      >
        <Stack align="center">
          <ImageFrame src={item.imageUrl} ratio={16 / 9} />
          <Text fw={700} ta="center" fz={25}  c={colors.text}>
            {item.title}
          </Text>
        </Stack>
        <Group justify={expiresAt ? "space-between" : "flex-end"} mt="md">
          {expiresAt && <ExpiryTimer expiresAt={expiresAt} />}
          {actions}
        </Group>
      </Card>
    );
  }
  if (type === "type_3") {
    return (
      <Card withBorder bd={`2px solid ${colors.accPrimary}`} bg={colors.bgBase}>
        <Box
          display="flex"
          style={{
            gap: "var(--mantine-spacing-lg)",
            alignItems: "center",
            flexDirection: mobile ? "column" : "row",
          }}
        >
          <Box style={{ flex: "0 0 34%" }}>
            <ImageFrame src={item.imageUrl} ratio={3 / 4}/>
          </Box>
          <Stack style={{ flex: 1, minWidth: 0 }}>
            <Text fw={700} style={{ overflowWrap: "anywhere" }} fz={25} c={colors.text}>
              {item.title}
            </Text>
            <Description value={item.description} />
          </Stack>
        </Box>
        <Group justify={expiresAt ? "space-between" : "flex-end"} mt="md">
          {expiresAt && <ExpiryTimer expiresAt={expiresAt} />}
          {actions}
        </Group>
      </Card>
    );
  }
  return (
    <Card withBorder bd={`2px solid ${colors.accPrimary}`} bg={colors.bgBase}>
      <Stack align="center">
        <Text fw={700} ta="center" fz={25} c={colors.text}>
          {item.title}
        </Text>
        <Description value={item.description} />
      </Stack>
      <Group justify={expiresAt ? "space-between" : "flex-end"} mt="md">
        {expiresAt && <ExpiryTimer expiresAt={expiresAt} />}
        {actions}
      </Group>
    </Card>
  );
}
