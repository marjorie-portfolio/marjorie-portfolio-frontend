import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { Text } from "@mantine/core";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ItemFormModal from "../components/modals/ItemFormModal";
import DeleteItemModal from "../components/modals/DeleteItemModal";
import CardsModal from "../components/modals/CardsModal";
import { getModalStyles } from "../helpers/modalStyles";
import { useTheme } from "../context/ThemeContext";
import useAuthState from "../store/useAuthStore";
import type { Section, SectionItem } from "../types/section.types";
import { getExpiresAt, getRememberedSectionExpiry, isTemporary } from "../utils/content";

type SectionIntent = {
  type: "add" | "edit" | "delete";
  itemId?: number;
};

type SectionLocationState = {
  intent?: SectionIntent;
};

export default function useSectionActions(
  sectionId: number | null,
  section: Section | undefined,
  items: SectionItem[],
) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthState();
  const { colors } = useTheme();
  const modalStyles = useMemo(
    () => getModalStyles(colors, { hideScrollbar: true, bodyPadding: 10 }),
    [colors],
  );
  const sectionExpiresAt = useMemo(
    () =>
      section
        ? (getExpiresAt(section) ?? getRememberedSectionExpiry(section.id))
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

  const openForm = useCallback(
    (item?: SectionItem, skipWarning = false) => {
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
    },
    [
      isAuthenticated,
      location.pathname,
      modalStyles,
      navigate,
      openItemModal,
      sectionId,
      user?.role,
    ],
  );

  const confirmDelete = useCallback(
    (item: SectionItem) => {
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
    },
    [
      isAuthenticated,
      location.pathname,
      modalStyles,
      navigate,
      sectionId,
      user?.role,
    ],
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
    const state = location.state as SectionLocationState | null;
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
    confirmDelete,
    isAuthenticated,
    items,
    location.pathname,
    location.state,
    openForm,
    section,
  ]);

  return {
    colors,
    sectionExpiresAt,
    openForm,
    confirmDelete,
    openCards,
  };
}
