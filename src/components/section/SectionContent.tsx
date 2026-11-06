import { Button, Skeleton, Stack, Text } from "@mantine/core";
import type { SectionItem } from "../../types/section.types";
import ItemRenderer from "./ItemRenderer";

type SectionContentProps = {
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  items: SectionItem[];
  orderedItems: SectionItem[];
  draggedItemId: number | null;
  onEdit: (item: SectionItem) => void;
  onDelete: (item: SectionItem) => void;
  onDragStart: (itemId: number) => void;
  onDragEnd: () => void;
  onDrop: (itemId: number) => void;
  backgroundColor: string;
};

export default function SectionContent({
  isPending,
  isError,
  onRetry,
  items,
  orderedItems,
  draggedItemId,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  onDrop,
  backgroundColor,
}: SectionContentProps) {
  if (isPending) {
    return (
      <Stack>
        {[1, 2, 3].map((key) => (
          <Skeleton key={key} h={300} animate color={backgroundColor} />
        ))}
      </Stack>
    );
  }

  if (isError) {
    return (
      <Stack align="center">
        <Text c="red">Unable to load this section.</Text>
        <Button onClick={onRetry}>Retry</Button>
      </Stack>
    );
  }

  if (items.length === 0) {
    return (
      <Text ta="center" bg={backgroundColor}>
        No items yet. Tap + to add one.
      </Text>
    );
  }

  return (
    <Stack>
      {orderedItems.map((item) => (
        <ItemRenderer
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item)}
          isDragging={draggedItemId === item.id}
          onDragStart={() => onDragStart(item.id)}
          onDragEnd={onDragEnd}
          onDrop={(event) => {
            event.preventDefault();
            onDrop(item.id);
          }}
        />
      ))}
    </Stack>
  );
}
