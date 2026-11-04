import { Text, Flex, Button } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";

type EndTitleProps = {
  onClick: () => void;
  isAuthenticated: boolean;
  role: string | null
};

export default function EndTitle({ onClick, isAuthenticated, role}: EndTitleProps) {
  const { colors } = useTheme();

  const getGreeting = () => {
    if (!isAuthenticated) return "WELCOME TO MY PORTFOLIO!";
    return role === "owner" ? "WELCOME BACK MARJORIE!!!" : "WELCOME, GUEST!";
  };

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
          {getGreeting()}
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
