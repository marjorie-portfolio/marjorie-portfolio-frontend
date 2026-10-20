import { useState } from "react";
import { Grid, Paper, Container, Text, Box } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";

import "./styles/GridImage.Module.css";

export default function GridImage({ data }: { data?: any }) {
  const rawItems: any[] = Array.isArray(data) ? data : [];
  const items = rawItems.slice(0, 4);
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
        {items.map((item: any, index: number) => {
          const firstItem = item.items?.[0];
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
                    <Text fw={600} size="xl" c={colors.text}>CLICK HERE!!!</Text>
                  </Paper>

                  {/* BACK FACE */}
                  <Paper
                    radius="lg"
                    className="cardFace backFace"
                    bg={colors.text}
                  >
                    <Box className="backContent">
                      <Text size="sm" c="gray.7" className="descriptionText">
                        {firstItem?.description || "No description provided."}
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
