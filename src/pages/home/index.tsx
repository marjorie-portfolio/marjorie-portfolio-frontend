import { Flex, ActionIcon, Divider, Text, Loader, Center } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { IconArrowBigDownLinesFilled } from "@tabler/icons-react";

import { useQuery } from "@tanstack/react-query";
import { sectionQueries } from "../../query/sections.query";

import { useTheme } from "../../context/ThemeContext";
import useAuthState from "../../store/useAuthStore";

import HomeTitle from "./components/HomeTitle";
import GridTitle from "./components/GridTitle";
import GridBoxes from "./components/GridBoxes";
import EndTitle from "./components/EndTitle";

export default function Home() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { isAuthenticated, user} = useAuthState();
  const mobile = useMediaQuery("(max-width: 768px)");

  const { data: sections, isPending: isSectionsPending } = useQuery(
    sectionQueries.all(),
  );

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
        <GridTitle/>
        {isSectionsPending ? (
          <Center py={100}>
            <Loader color={colors.accPrimary} />
          </Center>
        ) : (
          sections?.data.map((item) =>
            item.cards.length === 0 ? null : (
              <div key={item.id}>
                <Divider
                  label={
                    <Text
                      size="sm"
                      fw={700}
                      c={colors.text}
                      style={{ letterSpacing: "1px" }}
                      bg={colors.bgBase}
                      tt={"uppercase"}
                    >
                      {item.title}
                    </Text>
                  }
                  labelPosition="center"
                  size="sm"
                  color="pink.4"
                  mb={5}
                  mt={100}
                />
                <GridBoxes cards={item.cards} />
              </div>
            ),
          )
        )}

        <EndTitle
          onClick={() =>
            isAuthenticated ? navigate("/dashboard") : navigate("/sign-in")
          }
          isAuthenticated={isAuthenticated}
          role={user?.role ?? null}
        />
      </Flex>
    </Flex>
  );
}
