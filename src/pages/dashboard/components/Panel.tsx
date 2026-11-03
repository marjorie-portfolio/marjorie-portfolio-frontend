import type {ReactNode} from 'react'
import { Paper, Box, Text, Group } from '@mantine/core';
import { useTheme } from "../../../context/ThemeContext";

type PanelProps = {
  title: string;
  children: ReactNode;
  flex?: string | number;
  mih?: number | string;
  action?: ReactNode;
};

export default function Panel({ title, children, flex, mih, action }: PanelProps) {
  const { colors } = useTheme();

  return (
    <Paper
      radius="lg"
      style={{
        border: `3px solid ${colors.accPrimary}`,
        backgroundColor: colors.bgBase,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flex,
        minHeight: mih,
      }}
    >
      <Box px="md" py={6} style={{ borderBottom: `3px solid ${colors.accPrimary}` }}>
        <Group justify="space-between">
          <Text c={colors.text} fz={12} fw={700} tt="uppercase">{title}</Text>
          {action}
        </Group>
      </Box>
      <Box style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>{children}</Box>
    </Paper>
  );
}