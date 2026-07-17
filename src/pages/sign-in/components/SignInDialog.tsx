import { Paper, Text, Box, TextInput, Flex, Button } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";

export default function SignInDialog() {
  const { colors } = useTheme();

  return (
    <>
      <Paper
        shadow="xl"
        style={{
          border: `3px solid ${colors.accPrimary}`,
        }}
        w={"35%"}
        bg={colors.bgHighlight}
        c={colors.accPrimary}
      >
        <Box
          p={10}
          style={{
            borderBottom: `3px solid ${colors.accPrimary}`,
          }}
        >
          <Text fw={600} fz={18} ta={"center"}>
            WELCOME BACK, MARJORIE!
          </Text>
          <Text mt={-10} ta={"center"}>
            Sign in to continue building your professional story.
          </Text>
        </Box>
        <Box px={100} py={80}>
          <Flex direction={"column"} gap={20}>
            <TextInput
              label="Email or Username"
              placeholder="Enter your email or password..."
              styles={{
                label: {
                  color: colors.accPrimary,
                },
                input: {
                  color: colors.text,
                  border: `2px solid ${colors.accPrimary}`,
                  backgroundColor: colors.bgHighlight,
                },
              }}
              size="md"
            />
            <TextInput
              label="Password"
              placeholder="Enter your password..."
              styles={{
                label: {
                  color: colors.accPrimary,
                },
                input: {
                  color: colors.text,
                  border: `2px solid ${colors.accPrimary}`,
                  backgroundColor: colors.bgHighlight,
                },
              }}
              size="md"
            />
            <Flex w={"100%"} align={"center"} justify={"center"}>
              <Button w={100} variant="outline" color={colors.accPrimary}>SIGN-IN</Button>
            </Flex>
          </Flex>
        </Box>
      </Paper>
    </>
  );
}
