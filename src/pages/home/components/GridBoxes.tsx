import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Grid, Paper, Container, Text, Box, Divider } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import "./styles/GridImage.Module.css";

import { cardQueries } from "../../../query/cards.query";

export default function GridBoxes({ sectionId }: { sectionId: any }) {
  const { data: cards } = useQuery(cardQueries.list(sectionId));

  const rawItems: any[] = Array.isArray(cards?.data) ? cards?.data : [];

  const { colors } = useTheme();

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Container size="xl" py="xl" w="100%">
      <Grid gutter="md">
        {rawItems.map((item: any, index: number) => {
          const isFlipped = !!flippedCards[index];

          return (
            <Grid.Col key={item.id ?? index} span={{ base: 12, sm: 3 }}>
              <Box
                onClick={() => toggleFlip(index)}
                className="cardPerspective"
              >
                <Box className={`cardInner ${isFlipped ? "flipped" : ""}`}>
                  {/* FRONT FACE */}
                  <Paper
                    radius="lg"
                    p={0}
                    className="cardFace"
                    bg={colors.accPrimary}
                  >
                    <Text fw={600} size="xl" c={colors.text}>
                      CLICK HERE!!!
                    </Text>
                  </Paper>

                  {/* BACK FACE */}
                  <Paper
                    radius="lg"
                    className="cardFace backFace"
                    bg={colors.text}
                  >
                    <Box className="backContent">
                      <Text size="sm" c="gray.7" className="descriptionText">
                        {item?.description || "No description provided."}
                      </Text>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Grid.Col>
          );
        })}
      </Grid>
    </Container>
  );
}
