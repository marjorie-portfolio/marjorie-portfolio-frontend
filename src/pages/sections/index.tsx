import {
  ActionIcon,
  Affix,
  Button,
  Container,
  Loader,
  Skeleton,
  Stack,
  Text,
  Flex
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { IconPlus, IconBoxMultiple  } from "@tabler/icons-react";
import PageHeader from "../../components/common/PageHeader";
import ItemFormModal from "../../components/modals/ItemFormModal";
import CardsModal from "../../components/modals/CardsModal";
import ItemRenderer from "../../components/section/ItemRenderer";
import { deleteItem } from "../../api/items.api";
import { sectionQueries, sectionsKey } from "../../query/sections.query";
import type { SectionItem } from "../../types/section.types";
import useAuthState from "../../store/useAuthStore";
import { useTheme } from "../../context/ThemeContext";
import ExpiryTimer from "../../components/ExpiryTimer";
import {
  getExpiresAt,
  getRememberedSectionExpiry,
  isTemporary,
} from "../../utils/content";

export default function Section() {
  const { id } = useParams<{ id: string }>();
  const sectionId = id && /^\d+$/.test(id) ? Number(id) : null;
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthState();
  const { colors } = useTheme();
  const modalStyles = {
    content: { 
      scrollbarWidth: "none" as const, // Firefox
      "-ms-overflow-style": "none", // IE and Edge
      "&::-webkit-scrollbar": {
        display: "none", // Chrome, Safari, Opera
      },
    },
    header: {
      backgroundColor: colors.bgSurface,
      borderBottom: `2px solid ${colors.bgHighlight}`,
    },
    body: { backgroundColor: colors.bgSurface, padding: 10 },
    title: { color: colors.text,    fontWeight: 800, },
    close: { color: colors.text },
  };
  const queryClient = useQueryClient();
  const query = useQuery({
    ...sectionQueries.all(sectionId ?? undefined),
    enabled: sectionId !== null,
    refetchInterval: 30_000,
  });
  const deletion = useMutation({
    mutationFn: (itemId: number) => deleteItem(sectionId ?? 0, itemId),
    onSuccess: async () => {
      if (sectionId === null) return;
      await queryClient.invalidateQueries({
        queryKey: sectionsKey.byId(sectionId),
      });
      notifications.show({
        title: "Item deleted",
        message: "The item was deleted successfully.",
        color: "primary",
      });
    },
    onError: () =>
      notifications.show({
        title: "Unable to delete item",
        message: "Please try again.",
        color: "primary",
      }),
  });
  const openForm = (item?: SectionItem, skipWarning = false) => {
    if (sectionId === null) return;
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: {
          from: location.pathname,
          intent: item ? { type: "edit", itemId: item.id } : { type: "add" },
        },
      });
      return;
    }
    if (item && user?.role === "guest" && !isTemporary(item)) {
      notifications.show({
        title: "Unable to edit item",
        message: "Guests can only change temporary content they added.",
        color: "primary",
      });
      return;
    }
    if (!item && user?.role === "guest" && !skipWarning) {
      modals.openConfirmModal({
        title: "Guest content",
        children: (
          <Text>
            Anything you add as a guest is public and will be deleted
            automatically after 5 minutes.
          </Text>
        ),
        labels: { confirm: "Continue", cancel: "Cancel" },
        centered: true,
        styles: modalStyles,
        onConfirm: () => openForm(undefined, true),
      });
      return;
    }
    modals.open({
      title: item ? "Edit item" : "Add item khate",
      children: <ItemFormModal sectionId={sectionId} item={item} />,
      centered: true,
      styles: modalStyles,
    });
  };
  const confirmDelete = (item: SectionItem) => {
    if (!isAuthenticated) {
      navigate("/sign-in", {
        state: {
          from: location.pathname,
          intent: { type: "delete", itemId: item.id },
        },
      });
      return;
    }
    if (user?.role === "guest" && !isTemporary(item)) {
      notifications.show({
        title: "Unable to delete item",
        message: "Guests can only change temporary content they added.",
        color: "primary",
      });
      return;
    }
    modals.openConfirmModal({
      title: "Delete item",
      children: <Text> Are you sure you want to delete this item "{item.title}"?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "primary" },
      centered: true,
      styles: modalStyles,
      onConfirm: () => deletion.mutate(item.id),
    });
  };

  const section = query.data?.data?.[0];
  const sectionExpiresAt = section
    ? getExpiresAt(section) ?? getRememberedSectionExpiry(section.id)
    : null;
  const canManageCards =
    user?.role === "owner" ||
    Boolean(sectionExpiresAt) ||
    (user?.role === "guest" && (section ? isTemporary(section) : false));
  const items = [...(section?.items ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id,
  );
  useEffect(() => {
    const state = location.state as {
      intent?: { type: "add" | "edit" | "delete"; itemId?: number };
    } | null;
    if (!isAuthenticated || !state?.intent || !section) return;
    const intent = state.intent;
    window.history.replaceState({}, document.title, location.pathname);
    const target =
      intent.itemId === undefined
        ? undefined
        : items.find((item) => item.id === intent.itemId);
    if (intent.type === "add") openForm();
    if (intent.type === "edit" && target) openForm(target);
    if (intent.type === "delete" && target) confirmDelete(target);
  }, [isAuthenticated, section, location.pathname]);
  return (
    <Container size="xl" w={"100%"}>
      <PageHeader
        uppercase={false}
        title={
          query.isPending ? (
            <Loader type="dots" color={colors.accPrimary} />
          ) : (
            <Flex align="center" gap="xs">
              {section?.title}
              {sectionExpiresAt && (
                <ExpiryTimer expiresAt={sectionExpiresAt} />
              )}
            </Flex>
          )
        }
      />
      {query.isPending && (
        <Stack>
          {[1, 2, 3].map((key) => (
          <Skeleton key={key} h={300} animate={true}/>
          ))}
        </Stack>
      )}
      {query.isError && (
        <Stack align="center">
          <Text c="red">Unable to load this section.</Text>
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </Stack>
      )}
      {!query.isPending &&
        !query.isError &&
        section &&
        (items.length === 0 ? (
          <Text ta="center" bg={colors.bgBase}>No items yet. Tap + to add one.</Text>
        ) : (
          <Stack>
            {items.map((item) => (
              <ItemRenderer
                key={item.id}
                item={item}
                onEdit={() => openForm(item)}
                onDelete={() => confirmDelete(item)}
              />
            ))}
          </Stack>
        ))}
      {section && (
        <Affix position={{ bottom: 24, right: 24 }}>
          <Flex direction={"column"} gap={5}>
          <ActionIcon
            size="xl"
            radius="xl"
            aria-label="Manage cards"
            onClick={() => {
              if (sectionId === null) return;
              if (!isAuthenticated) {
                navigate("/sign-in", {
                  state: { from: location.pathname, intent: { type: "add" } },
                });
                return;
              }
              if (!canManageCards) {
                notifications.show({
                  title: "Unable to change cards",
                  message: "Guests can only change temporary content they added.",
                  color: "primary",
                });
                return;
              }
              modals.open({
                title: "Cards",
                children: <CardsModal sectionId={sectionId} />,
                centered: true,
                styles: modalStyles,
              });
            }}
          >
            <IconBoxMultiple  color={"white"}/>
          </ActionIcon>
          <ActionIcon
            size="xl"
            radius="xl"
            aria-label="Add item"
            onClick={() => openForm()}
          >
            <IconPlus color={"white"}/>
          </ActionIcon></Flex>
        </Affix>
      )}
    </Container>
  );
}
