import type {ReactNode} from 'react'
import { Paper, Box, Text } from '@mantine/core';
import { useTheme } from "../../../context/ThemeContext";

type PanelProps = {
  title: string;
  children: ReactNode;
  flex?: string | number;
  mih?: number | string;
};

export default function Panel({ title, children, flex, mih }: PanelProps) {
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
        <Text c={colors.text} fz={12} fw={700} tt="uppercase">
          {title}
        </Text>
      </Box>
      <Box style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>{children}</Box>
    </Paper>
  );
}