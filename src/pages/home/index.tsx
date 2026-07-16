import { Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

import HomeTitle from "./components/HomeTitle";
import GridTitle from "./components/GridTitle";
import GridImage from "./components/GridImage";
import EndTitle from "./components/EndTitle"

export default function Home() {
  const { colors } = useTheme();
  const navigate = useNavigate()

  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <Flex direction="column" p={mobile ? 0 : 50} align={mobile ? "center" : ""} gap={100}> 
      <HomeTitle/>
      <GridTitle/>
      <GridImage/>
      <EndTitle onClick={() => navigate("/sign-in")}/>
    </Flex>
  );
}
