import { Flex, Paper, Grid, Text, Box, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useTheme } from "../../context/ThemeContext";

import PageHeader from "../../components/common/PageHeader";

const smallButtons = [
  { name: "SKILLS", count: 20 },
  { name: "PROJECTS", count: 20 },
  { name: "CERTIFICATIONS", count: 20 },
  { name: "VISITORS", count: 20 },
];

export default function DashBoard() {
  const { colors } = useTheme();
  const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Box>
      <Flex align={"center"} direction={"column"} p={0}>
        <PageHeader title="DASHB0ARD" hideBackButton />

        <Grid w={"100%"} p={50}>
          <Grid.Col span={mobile? 5 :1.3}>
            <Flex direction={mobile? "row" : "column"} justify="space-between" h={650}>
              {smallButtons.map((smallButton) => (
                <Paper
                  shadow="xs"
                  withBorder
                 ta={"center"}
                  style={{
                    border: `3px solid ${colors.accPrimary}`,
                    backgroundColor: `${colors.bgBase}`,
                  }}
                  h={110}
                >
                  <Stack gap={"md"}>
                    <Text c={colors.text} fz={20} fw={700}>{smallButton.name}</Text>
                  <Text c={colors.textDimmed} fz={40} fw={500}>{smallButton.count}</Text>
                  </Stack>
                </Paper>
              ))}
            </Flex>
          </Grid.Col>
          <Grid.Col span={10.7} pl="xl">
            <Paper
              shadow="xs"
              withBorder
              p="xl"
              h={"100%"}
              style={{
                border: `3px solid ${colors.accPrimary}`,
                backgroundColor: `${colors.bgBase}`,
              }}
            ></Paper>
          </Grid.Col>
        </Grid>
      </Flex>
    </Box>
  );
}
