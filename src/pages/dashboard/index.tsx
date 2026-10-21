import { useMemo } from "react";
import {
  Flex,
  Paper,
  Grid,
  Text,
  Box,
  Stack,
  Group,
  UnstyledButton,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";

import { useTheme } from "../../context/ThemeContext";

import PageHeader from "../../components/common/PageHeader";
import Panel from "./components/Panel";

import useAuthState from "../../store/useAuthStore";

import { acitvityLogsQueries } from "../../query/acitvity-logs.query";
import { sectionQueries } from "../../query/sections.query";

import { formatTime } from "../../helpers/formatTime";

import type {
  ActivityAction,
  ActivityLogGroup,
} from "../../types/activity-logs.types";

const ACTION_META: Record<ActivityAction, { label: string; color: string }> = {
  CREATED: { label: "Added / Created", color: "#7fa88a" },
  DELETED: { label: "Deleted / Removed", color: "#c9667a" },
  UPDATED: { label: "Updated / Edited", color: "#d9a066" },
};

export default function DashBoard() {
  const { colors } = useTheme();
  const mobile = useMediaQuery("(max-width: 768px)");

  const { data: groupedLogs = [], isLoading } = useQuery(
    acitvityLogsQueries.all(),
  );

  const { data: sections, isLoading: isLoadingSections } = useQuery(
    sectionQueries.all(),
  );

  const sectionList = sections?.data ?? [];
  console.log(groupedLogs);
  const { user } = useAuthState();

  const visitors = user?.dashBoard.visitors;

  const cardStyle = {
    border: `3px solid ${colors.accPrimary}`,
    backgroundColor: colors.bgBase,
  };

  return (
    <Box>
      <Flex align="center" justify="center" direction="column" p={0}>
        <PageHeader title="DASHBOARD" hideBackButton />

        <Grid w="100%" p={mobile ? 16 : 50} gutter="lg" h={"60vh"}>
          {/* LEFT: Recent Activity */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Flex h={mobile ? 420 : "70vh"}>
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
                          fz={12}
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
                                    fz={11}
                                    fw={600}
                                    lineClamp={2}
                                  >
                                    {log.label}
                                  </Text>
                                  <Text c={colors.textDimmed} fz={10}>
                                    {log.entity} {log.entityId} ·{" "}
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
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Flex direction="column" gap="lg" h={mobile ? "auto" : "70vh"}>
              <Panel title="Sections" flex={1} mih={260}>
                {isLoadingSections ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    Loading...
                  </Text>
                ) : sectionList.length === 0 ? (
                  <Text c={colors.textDimmed} fz={12} p="md">
                    No sections yet.
                  </Text>
                ) : (
                  sectionList.map((section: any) => (
                    <Group
                      key={section.id}
                      gap={10}
                      px="md"
                      py={6}
                      wrap="nowrap"
                    >
                      <Box
                        w={7}
                        h={7}
                        style={{
                          borderRadius: "50%",
                          backgroundColor: colors.text,
                        }}
                      />
                      <Text c={colors.text} fz={14} fw={600}>
                        {section.title}
                      </Text>
                    </Group>
                  ))
                )}
              </Panel>

              <Flex gap="lg" h={mobile ? 110 : 120}>
                <UnstyledButton
                  onClick={() => {
                    /* TODO: open create-section modal / navigate */
                  }}
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
                    <Text c={colors.textDimmed} fz={mobile ? 28 : 36} fw={600}>
                      {visitors}
                    </Text>
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
