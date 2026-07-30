import { Flex, Stack, Paper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";


export default function Home() {

    const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Flex justify={"center"}>
      <Flex gap="md" w={mobile? "45%" :"50%"} direction={mobile? "column": "row"}>
        {/* Left Column */}
        <Stack flex={1}>
          <Paper h={mobile? 650/2 : 650}>ABOUT ME</Paper>
          <Paper h={mobile? 250/2 : 250}>MY JOURNEY</Paper>
        </Stack>

        {/* Right Column */}
        <Stack flex={1}>
          <Paper h={mobile? 250/2 : 250}>SKILLS</Paper>
          <Paper h={mobile? 650/2 : 650}>WORKS</Paper>
        </Stack>
      </Flex>
    </Flex>
  );
}
