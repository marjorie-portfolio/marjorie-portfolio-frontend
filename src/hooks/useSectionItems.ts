import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { itemMutations } from "../mutations/items.mutation";
import { sectionsKey } from "../query/sections.query";
import type { SectionItem } from "../types/section.types";

function sortItems(items: SectionItem[]) {
  return [...items].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id,
  );
}

export default function useSectionItems(
  sectionId: number | null,
  sectionItems: SectionItem[] | undefined,
) {
  const queryClient = useQueryClient();
  const items = useMemo(() => sortItems(sectionItems ?? []), [sectionItems]);
  const [orderedItems, setOrderedItems] = useState<SectionItem[]>([]);
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const handleReorderError = useCallback(() => {
    setOrderedItems(items);
    notifications.show({
      title: "Unable to reorder items",
      message: "The item order could not be saved. Please try again.",
      color: "red",
    });
  }, [items]);

  const reorderMutation = useMutation({
    ...itemMutations.reorder(sectionId ?? 0),
    onError: handleReorderError,
    onSettled: () => {
      if (sectionId !== null) {
        void queryClient.invalidateQueries({
          queryKey: sectionsKey.byId(sectionId),
        });
      }
    },
  });

  const handleDrop = useCallback(
    (targetItemId: number) => {
      if (
        draggedItemId === null ||
        draggedItemId === targetItemId ||
        reorderMutation.isPending
      ) {
        setDraggedItemId(null);
        return;
      }

      const nextItems = [...orderedItems];
      const sourceIndex = nextItems.findIndex(
        (item) => item.id === draggedItemId,
      );
      const targetIndex = nextItems.findIndex(
        (item) => item.id === targetItemId,
      );

      if (sourceIndex === -1 || targetIndex === -1) {
        setDraggedItemId(null);
        return;
      }

      const [movedItem] = nextItems.splice(sourceIndex, 1);
      nextItems.splice(targetIndex, 0, movedItem);
      setOrderedItems(nextItems);
      setDraggedItemId(null);
      reorderMutation.mutate(nextItems.map((item) => item.id));
    },
    [draggedItemId, orderedItems, reorderMutation],
  );

  return {
    items,
    orderedItems,
    draggedItemId,
    isReordering: reorderMutation.isPending,
    setDraggedItemId,
    handleDrop,
  };
}
