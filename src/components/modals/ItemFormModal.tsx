import {
  Button,
  FileInput,
  Group,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircleFilled } from "@tabler/icons-react";
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
import { ItemTypeStep } from "./ItemFormParts";

type Props = { sectionId: number; item?: SectionItem };

const typeLabels: Record<ItemType, string> = {
  type_1: "Title and description",
  type_2: "Image with title",
  type_3: "Image with title and description",
};

function getItemValidationError(
  type: ItemType,
  title: string,
  description: string,
  hasImage: boolean,
) {
  const missing =
    type === "type_3"
      ? !title || !hasImage || isDescriptionEmpty(description)
      : type === "type_2"
        ? !hasImage || !title
        : !title || isDescriptionEmpty(description);

  if (!missing) return null;
  return type === "type_3"
    ? "Title, image and description are required."
    : type === "type_2"
      ? "Image and title are required."
      : "Title and description are required.";
}

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
      <ItemTypeStep
        type={type}
        onTypeChange={setType}
        onContinue={() => setStep(1)}
      />
    );
  }

  const submit = () => {
    const trimmedTitle = title.trim();
    const validationError = getItemValidationError(
      type,
      trimmedTitle,
      description,
      hasImage,
    );
    if (validationError) {
      setError(validationError);
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
      <Text fw={700} c={colors.text} tt="uppercase">
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
      <Group justify="center" align="center">
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
