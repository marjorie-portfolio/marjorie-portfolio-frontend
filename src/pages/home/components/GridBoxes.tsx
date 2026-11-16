import { useState } from "react";
import { Grid, Paper, Container, Text, Box } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import "./styles/GridImage.Module.css";
import type { Card } from "../../../types/cards.types";

export default function GridBoxes({ cards }: { cards: Card[] }) {

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
      <Grid gap="md">
        {cards.map((item, index) => {
          const isFlipped = !!flippedCards[index];

          return (
            <Grid.Col key={item.id ?? index} span={{ base: 12, sm: 4 }}>
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
                    <Text fw={600} size="xl" c={colors.bgHighlight}>
                      CLICK HERE!!!
                    </Text>
                  </Paper>

                  {/* BACK FACE */}
                  <Paper
                    radius="lg"
                    className="cardFace backFace"
                    bg={colors.bgDialog}
                  >
                    <Box className="backContent">
                      <Text size="sm" c={colors.accPrimary} fw={600} className="descriptionText">
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
