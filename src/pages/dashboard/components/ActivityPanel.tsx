import { Box, Group, Stack, Text } from "@mantine/core";
import Panel from "./Panel";
import { formatTime } from "../../../helpers/formatTime";
import type {
  ActivityAction,
  ActivityLogGroup,
} from "../../../types/activity-logs.types";

const ACTION_META: Record<ActivityAction, { label: string; color: string }> = {
  CREATED: { label: "Added / Created", color: "#7fa88a" },
  DELETED: { label: "Deleted / Removed", color: "#c9667a" },
  UPDATED: { label: "Updated / Edited", color: "#d9a066" },
};

type ActivityPanelProps = {
  groups: ActivityLogGroup[];
  isLoading: boolean;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
};

export default function ActivityPanel({
  groups,
  isLoading,
  textColor,
  mutedTextColor,
  accentColor,
}: ActivityPanelProps) {
  return (
    <Panel title="Recent Activity" flex={1}>
      {isLoading ? (
        <Text c={mutedTextColor} fz={12} p="md">
          Loading...
        </Text>
      ) : groups.length === 0 ? (
        <Text c={mutedTextColor} fz={12} p="md">
          No recent activity yet.
        </Text>
      ) : (
        <Stack gap={0}>
          {groups.map((group) => (
            <Box key={group.date} px="md" py={6}>
              <Text
                c={textColor}
                fz={15}
                fw={700}
                pb={2}
                style={{ borderBottom: `1px solid ${accentColor}` }}
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
                        <Text c={textColor} fz={13} fw={600} lineClamp={2}>
                          {log.label}
                        </Text>
                        <Text c={mutedTextColor} fz={10}>
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
  );
}
