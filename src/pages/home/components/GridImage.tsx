import { Flex, Stack, Paper } from "@mantine/core";


export default function Home() {
  return (
    <Flex justify={"center"}>
      <Flex gap="md" w={1000}>
        {/* Left Column */}
        <Stack flex={1}>
          <Paper h={650}>ABOUT ME</Paper>
          <Paper h={250}>MY JOURNEY</Paper>
        </Stack>

        {/* Right Column */}
        <Stack flex={1}>
          <Paper h={250}>SKILLS</Paper>
          <Paper h={650}>WORKS</Paper>
        </Stack>
      </Flex>
    </Flex>
  );
}
