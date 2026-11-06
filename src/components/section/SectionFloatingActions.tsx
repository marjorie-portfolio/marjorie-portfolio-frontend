import { ActionIcon, Affix, Flex } from "@mantine/core";
import { IconBoxMultiple, IconPlus } from "@tabler/icons-react";

type SectionFloatingActionsProps = {
  onManageCards: () => void;
  onAddItem: () => void;
};

export default function SectionFloatingActions({
  onManageCards,
  onAddItem,
}: SectionFloatingActionsProps) {
  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Flex direction="column" gap={5}>
        <ActionIcon
          size="xl"
          radius="xl"
          aria-label="Manage cards"
          onClick={onManageCards}
        >
          <IconBoxMultiple color="white" />
        </ActionIcon>
        <ActionIcon
          size="xl"
          radius="xl"
          aria-label="Add item"
          onClick={onAddItem}
        >
          <IconPlus color="white" />
        </ActionIcon>
      </Flex>
    </Affix>
  );
}
