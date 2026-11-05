import { Box, Button, Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useTheme } from "../../context/ThemeContext";
import type { ItemType } from "../../types/section.types";

const ITEM_TYPES: ItemType[] = ["type_1", "type_2", "type_3"];

type TypeStepProps = {
  type: ItemType;
  onTypeChange: (type: ItemType) => void;
  onContinue: () => void;
};

export function ItemTypeStep({
  type,
  onTypeChange,
  onContinue,
}: TypeStepProps) {
  const { colors } = useTheme();

  return (
    <Stack role="radiogroup" aria-label="Choose item type">
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {ITEM_TYPES.map((candidate, index) => (
          <Card
            key={candidate}
            withBorder
            component="button"
            type="button"
            role="radio"
            aria-checked={type === candidate}
            tabIndex={type === candidate ? 0 : -1}
            onKeyDown={(event) => {
              if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
                return;
              }
              event.preventDefault();
              const offset =
                event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
              onTypeChange(ITEM_TYPES[(index + offset + ITEM_TYPES.length) % ITEM_TYPES.length]);
            }}
            onClick={() => onTypeChange(candidate)}
            style={{
              border:
                type === candidate
                  ? `2px solid ${colors.accPrimary}`
                  : `1px solid ${colors.bgHighlight}`,
              backgroundColor: colors.bgSurface,
              outline: "none",
            }}
          >
            <Stack align="center" gap="xs">
              <TypePreview type={candidate} colors={colors} />
              <Text fw={700} size="sm" c={colors.accPrimary}>
                {candidate === "type_1" ? "Text" : candidate === "type_2" ? "Image" : "Image + Text"}
              </Text>
              <Text size="xs" c={colors.textDimmed} ta="center">
                {candidate === "type_1"
                  ? "Title and description, no image"
                  : candidate === "type_2"
                    ? "Image with title below"
                    : "Image left, title and description right"}
              </Text>
              {type === candidate && (
                <IconCheck size={18} color={colors.accPrimary} aria-hidden="true" />
              )}
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
      <Button fullWidth onClick={onContinue}>
        CONTINUE
      </Button>
    </Stack>
  );
}

function TypePreview({
  type,
  colors,
}: {
  type: ItemType;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  if (type === "type_1") {
    return (
      <Box w="100%" h={70} p="xs" bg={colors.bgHighlight} style={{ borderRadius: 8 }}>
        <Stack gap={5} align="center" justify="center" h="100%">
          <Box w="45%" h={6} bg={colors.accPrimary} />
          <Box w="80%" h={4} bg={colors.textDimmed} />
          <Box w="70%" h={4} bg={colors.textDimmed} />
        </Stack>
      </Box>
    );
  }
  if (type === "type_2") {
    return (
      <Box w="100%" h={70} p="xs" bg={colors.bgHighlight} style={{ borderRadius: 8 }}>
        <Stack gap={5} align="center" justify="center" h="100%">
          <Box w="80%" h={36} bg={colors.accPrimary} />
          <Box w="55%" h={5} bg={colors.textDimmed} />
        </Stack>
      </Box>
    );
  }
  return (
    <Box w="100%" h={70} p="xs" bg={colors.bgHighlight} style={{ borderRadius: 8 }}>
      <Group gap="xs" h="100%">
        <Box w="38%" h="80%" bg={colors.accPrimary} />
        <Stack gap={5} flex={1}>
          <Box w="80%" h={6} bg={colors.textDimmed} />
          <Box w="100%" h={4} bg={colors.textDimmed} />
          <Box w="90%" h={4} bg={colors.textDimmed} />
        </Stack>
      </Group>
    </Box>
  );
}
