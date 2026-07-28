import { Flex, Paper, Grid, Text, Box, Stack } from "@mantine/core";

import { useTheme } from "../../context/ThemeContext";
import { IconBriefcaseFilled } from "@tabler/icons-react";

import PageHeader from "../../components/common/PageHeader";

export default function DashBoard() {
  const { colors } = useTheme();
  return (
    <Box>
      <Flex align={"center"} direction={"column"} p={0}>
        <PageHeader title="DASHB0ARD" />

        <Grid w={"100%"} p={50}>
          <Grid.Col span={1.3}>
            <Flex direction="column" justify="space-evenly" h={650}>
              <Paper
                shadow="xs"
                withBorder
                p="xl"
                style={{
                  border: `3px solid ${colors.accPrimary}`,
                  backgroundColor: `${colors.bgBase}`
                }}
                h={110}
              ></Paper>
              <Paper
                shadow="xs"
                withBorder
                p="xl"
                h={110}
                style={{
                  border: `3px solid ${colors.accPrimary}`,
                  backgroundColor: `${colors.bgBase}`
                }}
              ></Paper>
              <Paper
                shadow="xs"
                withBorder
                p="xl"
                h={110}
                style={{
                  border: `3px solid ${colors.accPrimary}`,
                  backgroundColor: `${colors.bgBase}`
                }}
              ></Paper>
              <Paper
                shadow="xs"
                withBorder
                p="xl"
                h={110}
                style={{
                  border: `3px solid ${colors.accPrimary}`,
                  backgroundColor: `${colors.bgBase}`
                }}
              ></Paper>
            </Flex>
          </Grid.Col>
          <Grid.Col span={10.7}>
            <Paper
              shadow="xs"
              withBorder
              p="xl"
              h={"100%"}
              style={{
                border: `3px solid ${colors.accPrimary}`,
                backgroundColor: `${colors.bgBase}`
              }}
            ></Paper>
          </Grid.Col>
        </Grid>
      </Flex>
    </Box>
  );
}
