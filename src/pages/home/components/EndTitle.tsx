import { Text, Flex, Button, Box } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";

type EndTitleProps = {
  onClick: () => void;
  isAuthenticated: boolean;
};

export default function EndTitle({ onClick, isAuthenticated }: EndTitleProps) {
  const { colors } = useTheme();
  return (
    <Flex justify={"center"}>
      <Flex
        direction={"column"}
        bg={colors.bgBase}
        p={10}
        gap={10}
        align={"center"}
        bdrs={20}
      >
        <Text ff={"Share Tech Mono"} fz={20} c={colors.text}>
          WELCOME BACK MARJORIE!!!
        </Text>
        <Button
          variant="outline"
          color={colors.accPrimary}
          
          onClick={onClick}
        >
          {isAuthenticated ? "DASHBOARD" : "SIGN IN"}
        </Button>
      </Flex>
    </Flex>
  );
}
