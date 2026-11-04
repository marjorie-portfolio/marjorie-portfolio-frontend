import { Text, Flex } from "@mantine/core";

import { useTheme } from "../../../context/ThemeContext";

interface SubTitleProps {
  mobile: boolean;
}

export default function SubTitle({ mobile }: SubTitleProps) {
  const { colors } = useTheme();

  return (
    <>
      <Flex
        direction={mobile ? "column" : "row"}
        p={10}
        bg={colors.bgBase}
        align={"center"}
        justify={"center"}
        w={"auto"}
      >
        <Text
          c={colors.accPrimary}
          fw={700}
          ta={"center"}
          fz={mobile ? 18 : 23}
        >
          My journey evolves—
        </Text>
        <Text c={colors.text} fw={500} fz={mobile ? 15 : 20}>
          see what’s building next.
        </Text>
      </Flex>
    </>
  );
}
