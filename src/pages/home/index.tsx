import { Flex, ActionIcon } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconArrowBigDownLinesFilled } from "@tabler/icons-react";

import { useTheme } from "../../context/ThemeContext";
import useAuthState from "../../store/useAuthStore";

import HomeTitle from "./components/HomeTitle";
import GridTitle from "./components/GridTitle";
import GridImage from "./components/GridImage";
import EndTitle from "./components/EndTitle";

export default function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { isAuthenticated } = useAuthState();
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <Flex
      direction="column"
      p={mobile ? 0 : 50}
      align={mobile ? "center" : ""}
      gap={50}
    >
      <HomeTitle />

      <Flex justify={"center"}>
        <ActionIcon disabled size={"xl"} bg={colors.bgBase}>
          <IconArrowBigDownLinesFilled color={colors.accPrimary} size={30} />
        </ActionIcon>
      </Flex>

      <Flex direction="column" gap={100}>
        <GridTitle />
        <GridImage />
        <EndTitle
          onClick={() =>
            isAuthenticated ? navigate("/dashboard") : navigate("/sign-in")
          }
          isAuthenticated={isAuthenticated}
        />
      </Flex>
    </Flex>
  );
}
