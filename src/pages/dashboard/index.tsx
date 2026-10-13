import { Flex, Paper, Grid, Text, Box, Stack, SimpleGrid } from "@mantine/core";
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
      <Flex align={"center"}  direction={"column"} p={0}>
        <PageHeader title="DASHB0ARD" hideBackButton />

        <Grid w={"100%"}  p={mobile ? 16 : 50} gutter="xs" >
          <Grid.Col span={mobile ? 12 : 1.5}>
            <SimpleGrid cols={mobile ? 2 : 1} spacing="md" h={mobile? 200 : 700}>
              {smallButtons.map((smallButton) => (
                <Paper
                  key={smallButton.name}
                  shadow="xs"
                  withBorder
                  ta="center"
                  p="sm" 
                 
                  style={{
                    border: `3px solid ${colors.accPrimary}`,
                    backgroundColor: colors.bgBase,
                    wordBreak: "break-word", 
                    alignItems: "center"
                  }}
                >
                  <Stack gap="4" justify="center" align="center" h="100%">
                    <Text 
                      c={colors.text} 
                      fz={mobile ? 13 : 14} 
                      fw={700}
                      lh={1.2}
                    >
                      {smallButton.name}
                    </Text>

                    <Text c={colors.textDimmed} fz={mobile ? 28 : 36} fw={500}>
                      {smallButton.count}
                    </Text>
                  </Stack>
                </Paper>
              ))}
            </SimpleGrid>
          </Grid.Col>

          <Grid.Col span={mobile ? 12 : 10.5} pl={mobile ? 0 : "xl"}>
            <Paper
              shadow="xs"
              withBorder
              p="xl"
              minH={400} 
              h={"100%"}
              style={{
                border: `3px solid ${colors.accPrimary}`,
                backgroundColor: `${colors.bgBase}`,
              }}
            />
          </Grid.Col>
        </Grid>
      </Flex>
    </Box>
  );
}