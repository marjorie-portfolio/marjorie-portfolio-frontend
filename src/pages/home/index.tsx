import { Flex, ActionIcon, Divider, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconArrowBigDownLinesFilled } from "@tabler/icons-react";

import { useQuery } from "@tanstack/react-query";
import { sectionQueries } from "../../query/sections.query";
import { cardQueries } from "../../query/cards.query";

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

  const { data: sections } = useQuery(sectionQueries.all());
  const { data: cards, isLoading } = useQuery(cardQueries.all());

  console.log(sections);

  return (
    <Flex
      direction="column"
      align={mobile ? "center" : ""}
      gap={50}
      p={mobile ? 0 : 50}
    >
      <HomeTitle />

      <Flex justify={"center"}>
        <ActionIcon disabled size={"xl"} bg={colors.bgBase}>
          <IconArrowBigDownLinesFilled color={colors.accPrimary} size={30} />
        </ActionIcon>
      </Flex>

      <Flex direction="column">
        <GridTitle />
        {sections?.data.map}
        <>
          <Divider
            label={
              <Text
                size="sm"
                fw={700}
                c={colors.text}
                style={{ letterSpacing: "1px" }}
                bg={colors.bgBase}
              >
                title
              </Text>
            }
            labelPosition="center"
            size="sm"
            color="pink.4"
            mb={5}
            mt={100}
          />
          <GridImage cards={cards?.data} sections={sections} />
        </>
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
