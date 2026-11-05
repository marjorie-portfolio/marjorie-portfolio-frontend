import {
  Flex,
  Paper,
  Grid,
  Text,
  Box,
  Stack,
  Group,
  UnstyledButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconPencilFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { useMemo } from "react";

import { useTheme } from "../../context/ThemeContext";

import PageHeader from "../../components/common/PageHeader";
import Panel from "./components/Panel";
import EditSectionModal from "./components/EditSectionModal";
import DeleteSectionModal from "./components/DeleteSectionModal";
import CreateSectionModals from "../../components/modals/create-section";

import useAuthState from "../../store/useAuthStore";
import { useVisits } from "../../query/analytics";

import { acitvityLogsQueries } from "../../query/acitvity-logs.query";
import { sectionQueries } from "../../query/sections.query";

import { formatTime } from "../../helpers/formatTime";
import { getModalStyles } from "../../helpers/modalStyles";

import type {
  ActivityAction,
  ActivityLogGroup,
} from "../../types/activity-logs.types";
import type { Section } from "../../types/section.types";
import ExpiryTimer from "../../components/ExpiryTimer";
import {
  getExpiresAt,
  getRememberedSectionExpiry,
  isTemporary,
} from "../../utils/content";

const ACTION_META: Record<ActivityAction, { label: string; color: string }> = {
  CREATED: { label: "Added / Created", color: "#7fa88a" },
  DELETED: { label: "Deleted / Removed", color: "#c9667a" },
  UPDATED: { label: "Updated / Edited", color: "#d9a066" },
};

export default function DashBoard() {
  const { colors } = useTheme();
  const navigate = useNavigate();
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

  const { user } = useAuthState();

  const { data: visits, isLoading: isLoadingVisits } = useVisits();

  const visitors = !user?.dashBoard?.visitors
    ? Number(visits?.data)
    : Number(user?.dashBoard.visitors);

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
        <Text fw={900} tt="uppercase">
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
        <Text>
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
          {/* LEFT: Recent Activity */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Flex h={mobile ? 420 : "70vh"} w={"100%"}>
              <Panel title="Recent Activity" flex={1}>
                {isLoading ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    Loading...
                  </Text>
                ) : groupedLogs.length === 0 ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    No recent activity yet.
                  </Text>
                ) : (
                  <Stack gap={0}>
                    {groupedLogs.map((group: ActivityLogGroup) => (
                      <Box key={group.date} px="md" py={6}>
                        <Text
                          c={colors.text}
                          fz={15}
                          fw={700}
                          pb={2}
                          style={{
                            borderBottom: `1px solid ${colors.accPrimary}`,
                          }}
                        >
                          {group.date}
                        </Text>

                        <Stack gap={6} pl="md" pt={8}>
                          {group.items.map((log) => {
                            const meta = ACTION_META[log.action];
                            return (
                              <Group
                                key={log.id}
                                gap={10}
                                wrap="nowrap"
                                align="flex-start"
                              >
                                <Box
                                  w={8}
                                  h={8}
                                  mt={4}
                                  title={meta.label}
                                  style={{
                                    borderRadius: "50%",
                                    backgroundColor: meta.color,
                                    flexShrink: 0,
                                  }}
                                />
                                <Box style={{ minWidth: 0, flex: 1 }}>
                                  <Text
                                    c={colors.text}
                                    fz={13}
                                    fw={600}
                                    lineClamp={2}
                                  >
                                    {log.label}
                                  </Text>
                                  <Text c={colors.textDimmed} fz={10}>
                                    {formatTime(new Date(log.createdAt))}
                                  </Text>
                                </Box>
                              </Group>
                            );
                          })}
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Panel>
            </Flex>
          </Grid.Col>

          {/* RIGHT: Features + actions */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Flex direction="column" gap="lg" h={mobile ? "auto" : "70vh"}>
              <Panel title="Sections" flex={1} mih={260}>
                {isLoadingSections ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    Loading...
                  </Text>
                ) : sectionList.length === 0 ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    No sections yet. Tap + to add one.
                  </Text>
                ) : (
                  sectionList.map((section: Section) => (
                    <Group
                      key={section.id}
                      gap={10}
                      px="md"
                      py={6}
                      wrap="nowrap"
                      onClick={() => navigate(`/section/${section.id}`)}
                      style={{ cursor: "pointer" }}
                    >
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
                          {(getExpiresAt(section) ??
                            getRememberedSectionExpiry(section.id)) && (
                            <ExpiryTimer
                              expiresAt={
                                getExpiresAt(section) ??
                                getRememberedSectionExpiry(section.id)
                              }
                            />
                          )}
                        </Group>
                      </Tooltip>
                      <ActionIcon
                        aria-label={`Edit section ${section.title}`}
                        variant="subtle"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEdit(section);
                        }}
                      >
                        <IconPencilFilled size={17} color={colors.text} />
                      </ActionIcon>
                      <ActionIcon
                        aria-label={`Delete section ${section.title}`}
                        variant="subtle"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDelete(section);
                        }}
                      >
                        <IconTrashFilled size={17} color={colors.text} />
                      </ActionIcon>
                    </Group>
                  ))
                )}
              </Panel>

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
