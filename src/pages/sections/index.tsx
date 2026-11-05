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
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo } from "react";
import { IconPlus, IconBoxMultiple } from "@tabler/icons-react";
import PageHeader from "../../components/common/PageHeader";
import { getModalStyles } from "../../helpers/modalStyles";
import ItemFormModal from "../../components/modals/ItemFormModal";
import DeleteItemModal from "../../components/modals/DeleteItemModal";
import CardsModal from "../../components/modals/CardsModal";
import ItemRenderer from "../../components/section/ItemRenderer";
import { sectionQueries } from "../../query/sections.query";
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
  const modalStyles = useMemo(
    () => getModalStyles(colors, { hideScrollbar: true, bodyPadding: 10 }),
    [colors],
  );
  const query = useQuery({
    ...sectionQueries.all(sectionId ?? undefined),
    enabled: sectionId !== null,
    refetchInterval: 30_000,
  });
  const openItemModal = useCallback(
    (item?: SectionItem) => {
      if (sectionId === null) return;
      modals.open({
        title: item ? "EDIT ITEM" : "ADD ITEM",
        size: 600,
        children: <ItemFormModal sectionId={sectionId} item={item} />,
        centered: true,
        styles: modalStyles,
      });
    },
    [modalStyles, sectionId],
  );
  const openForm = useCallback((item?: SectionItem, skipWarning = false) => {
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
        onConfirm: () => openItemModal(),
      });
      return;
    }
    openItemModal(item);
  }, [
    isAuthenticated,
    location.pathname,
    modalStyles,
    navigate,
    openItemModal,
    sectionId,
    user?.role,
  ]);
  const confirmDelete = useCallback((item: SectionItem) => {
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
    modals.open({
      title: "Delete item",
      children: <DeleteItemModal sectionId={sectionId ?? 0} item={item} />,
      centered: true,
      styles: modalStyles,
    });
  }, [
    isAuthenticated,
    location.pathname,
    modalStyles,
    navigate,
    sectionId,
    user?.role,
  ]);

  const section = query.data?.data?.[0];
  const sectionExpiresAt = useMemo(
    () =>
      section
        ? getExpiresAt(section) ?? getRememberedSectionExpiry(section.id)
        : null,
    [section],
  );
  const canManageCards = useMemo(
    () =>
      user?.role === "owner" ||
      Boolean(sectionExpiresAt) ||
      (user?.role === "guest" && Boolean(section && isTemporary(section))),
    [section, sectionExpiresAt, user?.role],
  );
  const items = useMemo(
    () =>
      [...(section?.items ?? [])].sort(
        (a, b) =>
          (a.displayOrder ?? 0) - (b.displayOrder ?? 0) || a.id - b.id,
      ),
    [section?.items],
  );
  const openCards = useCallback(() => {
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
  }, [
    canManageCards,
    isAuthenticated,
    location.pathname,
    modalStyles,
    navigate,
    sectionId,
  ]);
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
  }, [
    isAuthenticated,
    items,
    location.pathname,
    location.state,
    openForm,
    confirmDelete,
    section,
  ]);
  return (
    <Container size="xl" w={"100%"} >
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
          <Skeleton key={key} h={300} animate={true} color={colors.bgBase}/>
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
          <Stack >
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
        <Affix position={{ bottom: 24, right: 24 }} >
          <Flex direction={"column"} gap={5}>
          <ActionIcon
            size="xl"
            radius="xl"
            aria-label="Manage cards"
            onClick={openCards}
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
