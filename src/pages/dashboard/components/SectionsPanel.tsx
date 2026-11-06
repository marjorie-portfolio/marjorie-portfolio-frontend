import {
  ActionIcon,
  Box,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconGripVertical,
  IconPencilFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useTheme } from "../../../context/ThemeContext";
import Panel from "./Panel";
import ExpiryTimer from "../../../components/ExpiryTimer";
import { getExpiresAt, getRememberedSectionExpiry } from "../../../utils/content";
import type { Section } from "../../../types/section.types";

type SectionsPanelProps = {
  sections: Section[];
  isLoading: boolean;
  onOpen: (section: Section) => void;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
  draggedSectionId: number | null;
  onDragStart: (sectionId: number) => void;
  onDragEnd: () => void;
  onDrop: (sectionId: number) => void;
};

export default function SectionsPanel({
  sections,
  isLoading,
  onOpen,
  onEdit,
  onDelete,
  draggedSectionId,
  onDragStart,
  onDragEnd,
  onDrop,
}: SectionsPanelProps) {
  const { colors } = useTheme();

  return (
    <Panel title="Sections" flex={1} mih={260}>
      {isLoading ? (
        <Text c={colors.textDimmed} fz={12} p="md">
          Loading...
        </Text>
      ) : sections.length === 0 ? (
        <Text c={colors.textDimmed} fz={12} p="md">
          No sections yet. Tap + to add one.
        </Text>
      ) : (
        sections.map((section) => {
          const expiresAt =
            getExpiresAt(section) ?? getRememberedSectionExpiry(section.id);
          return (
            <Group
              key={section.id}
              gap={10}
              px="md"
              py={6}
              wrap="nowrap"
              onClick={() => onOpen(section)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                event.preventDefault();
                onDrop(section.id);
              }}
              style={{
                cursor: "pointer",
                opacity: draggedSectionId === section.id ? 0.4 : 1,
                transition: "opacity 0.2s ease",
              }}
            >
              <ActionIcon
                size="sm"
                variant="subtle"
                aria-label={`Reorder section ${section.title}`}
                draggable
                onClick={(event) => event.stopPropagation()}
                onDragStart={(event) => {
                  event.stopPropagation();
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(section.id));
                  onDragStart(section.id);
                }}
                onDragEnd={onDragEnd}
                style={{ cursor: "grab", touchAction: "none" }}
              >
                <IconGripVertical size={17} color={colors.text} />
              </ActionIcon>
              <Box
                w={7}
                h={7}
                style={{
                  borderRadius: "50%",
                  backgroundColor: colors.text,
                }}
              />
              <Tooltip label={section.title}>
                <Group gap={6} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    c={colors.text}
                    fz={14}
                    fw={600}
                    truncate
                    style={{ minWidth: 0 }}
                    tt="uppercase"
                  >
                    {section.title}
                  </Text>
                  {expiresAt && <ExpiryTimer expiresAt={expiresAt} />}
                </Group>
              </Tooltip>
              <ActionIcon
                aria-label={`Edit section ${section.title}`}
                variant="subtle"
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(section);
                }}
              >
                <IconPencilFilled size={17} color={colors.text} />
              </ActionIcon>
              <ActionIcon
                aria-label={`Delete section ${section.title}`}
                variant="subtle"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(section);
                }}
              >
                <IconTrashFilled size={17} color={colors.text} />
              </ActionIcon>
            </Group>
          );
        })
      )}
    </Panel>
  );
}
