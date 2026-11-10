import {
  Flex,
  Paper,
  Grid,
  Text,
  Box,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useTheme } from "../../context/ThemeContext";

import PageHeader from "../../components/common/PageHeader";
import EditSectionModal from "./components/EditSectionModal";
import DeleteSectionModal from "./components/DeleteSectionModal";
import CreateSectionModals from "../../components/modals/create-section";

import useAuthState from "../../store/useAuthStore";
import { useVisits } from "../../query/analytics";

import { acitvityLogsQueries } from "../../query/acitvity-logs.query";
import { sectionQueries } from "../../query/sections.query";

import { getModalStyles } from "../../helpers/modalStyles";

import type { Section } from "../../types/section.types";
import ActivityPanel from "./components/ActivityPanel";
import SectionsPanel from "./components/SectionsPanel";
import { isTemporary, getRememberedSectionExpiry } from "../../utils/content";
import { sectionMutations } from "../../mutations/sections.mutation";
import { sectionsKey } from "../../query/sections.query";
import { useVisits as useVisitsSocket } from "../../socket/useVisits";

export default function DashBoard() {
    useVisitsSocket()
  const { colors } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalStyles = useMemo(
    () => getModalStyles(colors, { compactHeader: true }),
    [colors],
  );
  const mobile = useMediaQuery("(max-width: 768px)");

  const { data: groupedLogs = [], isLoading } = useQuery(
    acitvityLogsQueries.all(),
  );

  const { data: sections, isLoading: isLoadingSections } = useQuery(
    sectionQueries.all(),
  );

  const sectionList = sections?.data ?? [];
  const [orderedSections, setOrderedSections] = useState<Section[]>([]);
  const [draggedSectionId, setDraggedSectionId] = useState<number | null>(null);

  useEffect(() => {
    setOrderedSections(sectionList);
  }, [sectionList]);

  const { user } = useAuthState();

  const reorderMutation = useMutation({
    ...sectionMutations.reorder,
    onError: () => {
      setOrderedSections(sectionList);
      notifications.show({
        title: "Unable to reorder sections",
        message: "The section order could not be saved. Please try again.",
        color: "red",
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: sectionsKey.all });
    },
  });

  const handleSectionDrop = useCallback(
    (targetSectionId: number) => {
      if (
        draggedSectionId === null ||
        draggedSectionId === targetSectionId ||
        reorderMutation.isPending
      ) {
        setDraggedSectionId(null);
        return;
      }

      const nextSections = [...orderedSections];
      const sourceIndex = nextSections.findIndex(
        (section) => section.id === draggedSectionId,
      );
      const targetIndex = nextSections.findIndex(
        (section) => section.id === targetSectionId,
      );
      if (sourceIndex === -1 || targetIndex === -1) {
        setDraggedSectionId(null);
        return;
      }

      const [movedSection] = nextSections.splice(sourceIndex, 1);
      nextSections.splice(targetIndex, 0, movedSection);
      setOrderedSections(nextSections);
      setDraggedSectionId(null);
      reorderMutation.mutate(nextSections.map((section) => section.id));
    },
    [draggedSectionId, orderedSections, reorderMutation],
  );

  const { data: visits, isLoading: isLoadingVisits } = useVisits();

  const visitors = Number(visits)

  const { nameModal } = CreateSectionModals();
  const canChange = (section: Section) => {
    if (user?.role === "owner") return true;
    if (
      (user?.role === "guest" && isTemporary(section)) ||
      Boolean(getRememberedSectionExpiry(section.id))
    ) {
      return true;
    }
    notifications.show({
      title: "Unable to change section",
      message: "Guests can only change temporary content they added.",
      color: "primary",
    });
    return false;
  };
  const openDelete = (section: Section) => {
    if (!canChange(section)) return;
    modals.open({
      title: "Delete section",
      children: <DeleteSectionModal section={section} />,
      centered: true,
      styles: modalStyles,
    });
  };
  const openEdit = (section: Section) => {
    if (!canChange(section)) return;
    modals.open({
      title: (
        <Text fw={900} tt="uppercase" c={colors.text}>
          EDIT SECTION
        </Text>
      ),
      children: <EditSectionModal section={section} />,
      centered: true,
      styles: modalStyles,
    });
  };
  const openAdd = () => {
    if (user?.role !== "guest") {
      nameModal();
      return;
    }
    modals.openConfirmModal({
      title: "Guest content",
      children: (
        <Text c={colors.text}>
          Anything you add as a guest is public and will be deleted
          automatically after 5 minutes.
        </Text>
      ),
      labels: { confirm: "Continue", cancel: "Cancel" },
      centered: true,
      styles: modalStyles,
      onConfirm: nameModal,
    });
  };

  const cardStyle = {
    border: `3px solid ${colors.accPrimary}`,
    backgroundColor: colors.bgBase,
  };

  return (
    <Box>
      <Flex align="center" justify="center" direction="column" p={0}>
        <PageHeader title="DASHBOARD" hideBackButton/>

        <Grid w="100%" p={mobile ? 16 : 50} h={mobile ? "100%" : "80"}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Flex h={mobile ? 420 : "70vh"} w={"100%"}>
              <ActivityPanel
                groups={groupedLogs}
                isLoading={isLoading}
                textColor={colors.text}
                mutedTextColor={colors.textDimmed}
                accentColor={colors.accPrimary}
              />
            </Flex>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Flex direction="column" gap="lg" h={mobile ? "auto" : "70vh"}>
              <SectionsPanel
                sections={orderedSections}
                isLoading={isLoadingSections}
                onOpen={(section) => navigate(`/section/${section.id}`)}
                onEdit={openEdit}
                onDelete={openDelete}
                draggedSectionId={draggedSectionId}
                onDragStart={setDraggedSectionId}
                onDragEnd={() => setDraggedSectionId(null)}
                onDrop={handleSectionDrop}
              />

              <Flex gap="lg" h={mobile ? 110 : 120}>
                <UnstyledButton
                  onClick={openAdd}
                  style={{ ...cardStyle, flex: 2, borderRadius: 16 }}
                >
                  <Stack justify="center" align="center" gap={0} h="100%">
                    <Text c={colors.text} fz={40} fw={900} lh={1}>
                      +
                    </Text>
                    <Text
                      c={colors.text}
                      fz={mobile ? 13 : 15}
                      fw={700}
                      tt="uppercase"
                    >
                      Create Section
                    </Text>
                  </Stack>
                </UnstyledButton>

                <Paper radius="lg" style={{ ...cardStyle, flex: 1 }}>
                  <Stack justify="center" align="center" gap={0} h="100%">
                    <Text
                      c={colors.text}
                      fz={mobile ? 13 : 15}
                      fw={700}
                      tt="uppercase"
                    >
                      Visitors
                    </Text>
                    {isLoadingVisits ? (
                      <Text c={colors.textDimmed} fz={12} p="md">
                        Loading...
                      </Text>
                    ) : (
                      <Text
                        c={colors.textDimmed}
                        fz={mobile ? 28 : 36}
                        fw={600}
                      >
                        {visitors}
                      </Text>
                    )}
                  </Stack>
                </Paper>
              </Flex>
            </Flex>
          </Grid.Col>
        </Grid>
      </Flex>
    </Box>
  );
}
