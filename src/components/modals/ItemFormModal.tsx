import {
  Button,
  Card,
  FileInput,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Box,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconAlertCircle,
  IconAlertCircleFilled,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { itemMutations } from "../../mutations/items.mutation";
import { sectionsKey } from "../../query/sections.query";
import type { ItemType, SectionItem } from "../../types/section.types";
import ImageFrame from "../section/ImageFrame";
import RichTextField from "../section/RichTextField";
import { isDescriptionEmpty } from "../../utils/content";
import { useTheme } from "../../context/ThemeContext";

type Props = { sectionId: number; item?: SectionItem };

const typeLabels: Record<ItemType, string> = {
  type_1: "Title and description",
  type_2: "Image with title",
  type_3: "Image with title and description",
};

export default function ItemFormModal({ sectionId, item }: Props) {
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const [type, setType] = useState<ItemType>(item?.itemType ?? "type_1");
  const [step, setStep] = useState(item ? 1 : 0);
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mutation = useMutation({
    ...(item
      ? itemMutations.update(sectionId, item.id)
      : itemMutations.create(sectionId)),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: sectionsKey.byId(sectionId),
      });
      notifications.show({
        title: item ? "Item updated" : "Item added",
        message: item ? "Your item was updated." : "Your item was added.",
        color: "primary",
      });
      modals.closeAll();
    },
    onError: () =>
      notifications.show({
        title: "Unable to save item",
        message: "Please try again.",
        color: "primary",
      }),
  });
  const requiresImage = type === "type_2" || type === "type_3";
  const hasImage = image instanceof File || Boolean(item?.imageUrl);

  if (step === 0) {
    return (
      <Stack role="radiogroup" aria-label="Choose item type">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          {(Object.keys(typeLabels) as ItemType[]).map((candidate, index) => (
            <Card
              key={candidate}
              withBorder
              component="button"
              type="button"
              role="radio"
              aria-checked={type === candidate}
              tabIndex={type === candidate ? 0 : -1}
              onKeyDown={(event) => {
                if (
                  event.key !== "ArrowRight" &&
                  event.key !== "ArrowDown" &&
                  event.key !== "ArrowLeft" &&
                  event.key !== "ArrowUp"
                )
                  return;
                event.preventDefault();
                const next =
                  event.key === "ArrowRight" || event.key === "ArrowDown"
                    ? (index + 1) % 3
                    : (index + 2) % 3;
                setType((Object.keys(typeLabels) as ItemType[])[next]);
              }}
              onClick={() => setType(candidate)}
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
                <Box
                  w="100%"
                  h={70}
                  p="xs"
                  bg={colors.bgHighlight}
                  style={{ borderRadius: 8 }}
                >
                  {candidate === "type_1" ? (
                    <Stack gap={5} align="center" justify="center" h="100%">
                      <Box w="45%" h={6} bg={colors.accPrimary} />
                      <Box w="80%" h={4} bg={colors.textDimmed} />
                      <Box w="70%" h={4} bg={colors.textDimmed} />
                    </Stack>
                  ) : candidate === "type_2" ? (
                    <Stack gap={5} align="center" justify="center" h="100%">
                      <Box w="80%" h={36} bg={colors.accPrimary} />
                      <Box w="55%" h={5} bg={colors.textDimmed} />
                    </Stack>
                  ) : (
                    <Group gap="xs" h="100%">
                      <Box w="38%" h="80%" bg={colors.accPrimary} />
                      <Stack gap={5} flex={1}>
                        <Box w="80%" h={6} bg={colors.textDimmed} />
                        <Box w="100%" h={4} bg={colors.textDimmed} />
                        <Box w="90%" h={4} bg={colors.textDimmed} />
                      </Stack>
                    </Group>
                  )}
                </Box>
                <Text fw={700} size="sm" c={colors.accPrimary}>
                  {candidate === "type_1"
                    ? "Text"
                    : candidate === "type_2"
                      ? "Image"
                      : "Image + Text"}
                </Text>
                <Text size="xs" c={colors.textDimmed} ta="center">
                  {candidate === "type_1"
                    ? "Title and description, no image"
                    : candidate === "type_2"
                      ? "Image with title below"
                      : "Image left, title and description right"}
                </Text>
                {type === candidate && (
                  <IconCheck
                    size={18}
                    color={colors.accPrimary}
                    aria-hidden="true"
                  />
                )}
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
        <Button fullWidth disabled={!type} onClick={() => setStep(1)}>
          CONTINUE
        </Button>
      </Stack>
    );
  }

  const submit = () => {
    const trimmedTitle = title.trim();
    const missing =
      type === "type_3"
        ? !trimmedTitle || !hasImage || isDescriptionEmpty(description)
        : type === "type_2"
          ? !hasImage || !trimmedTitle
          : !trimmedTitle || isDescriptionEmpty(description);
    if (missing) {
      setError(
        type === "type_3"
          ? "Title, image and description are required."
          : type === "type_2"
            ? "Image and title are required."
            : "Title and description are required.",
      );
      return;
    }
    if (image instanceof File && image.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    if (image instanceof File && !image.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    mutation.mutate({
      title: trimmedTitle,
      description: type === "type_2" ? "" : description,
      image: image ?? undefined,
      itemType: type,
    });
  };

  return (
    <Stack>
      <Text fw={700} c={colors.text}>
        {typeLabels[type]}
      </Text>
      <TextInput
        label="Title"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />
      {requiresImage && (
        <>
          <FileInput
            label="Image"
            accept="image/*"
            value={image}
            onChange={setImage}
            clearable
            error={requiresImage && !hasImage ? error : undefined}
          />
          <ImageFrame
            src={image ? URL.createObjectURL(image) : item?.imageUrl}
            ratio={type === "type_2" ? 16 / 9 : 3 / 4}
          />
        </>
      )}
      {type !== "type_2" && (
        <Stack gap="xs">
          <Text size="xs" fw={800} tt="uppercase" c={colors.text}>
            Description{" "}
            <Tooltip
              label="Enter key for more line gap. Shift + Enter keys to lessen line gap"
              withArrow
              position="top"
              
            >
              {/* Span wrapper is required so tooltip attaches correctly to the SVG icon */}
              <span style={{ display: "inline-flex", cursor: "pointer" }}>
                <IconAlertCircleFilled size={10} color={colors.accPrimary} />
              </span>
            </Tooltip>
          </Text>
          <RichTextField value={description} onChange={setDescription} />
        </Stack>
      )}
      {error && (
        <Text c={colors.accPrimary} size="sm">
          {error}
        </Text>
      )}
      <Group justify="space-between">
        {!item && (
          <Button variant="subtle" onClick={() => setStep(0)}>
            Back
          </Button>
        )}
        <Button loading={mutation.isPending} onClick={submit}>
          {item ? "Save changes" : "Add item"}
        </Button>
      </Group>
    </Stack>
  );
}
