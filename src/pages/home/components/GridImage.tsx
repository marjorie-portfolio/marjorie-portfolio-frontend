import { useState } from "react";
import { Grid, Paper, Container, Text, Box } from "@mantine/core";
import "./styles/GridImage.Module.css"; // Plain CSS import

export default function GridImage({ data }: { data?: any }) {
  const rawItems: any[] = Array.isArray(data) ? data : [];
  const items = rawItems.slice(0, 4);

  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const colSpans = [7, 5, 4, 8];

  return (
    <Container size="xl" py="xl" w="100%">
      <Grid gutter="md">
        {items.map((item: any, index: number) => {
          const firstItem = item.items?.[0];
          const isFlipped = !!flippedCards[index];

          return (
            <Grid.Col key={item.id ?? index} span={{ base: 12, sm: colSpans[index] }}>
              <Box
                onClick={() => toggleFlip(index)}
                className="cardPerspective"
              >
                <Box className={`cardInner ${isFlipped ? "flipped" : ""}`}>
                  {/* FRONT FACE */}
                  <Paper radius="lg" p={0} className="cardFace">
                    <Box className="frontContent">
                      <Text size="xs" c="dimmed" tt="uppercase" lts={1}>
                        Click to flip
                      </Text>
                    </Box>

                    <Box className="bottomBar">
                      <Text fw={800} size="sm" tt="uppercase" lts={1} c="black">
                        {item.title}
                      </Text>
                    </Box>
                  </Paper>

                  {/* BACK FACE */}
                  <Paper radius="lg" className="cardFace backFace">
                    <Box className="backContent">
                      <Text fw={700} size="md" c="dark.8" mb="xs">
                        {firstItem?.title || item.title}
                      </Text>
                      <Text size="sm" c="gray.7" className="descriptionText">
                        {firstItem?.description || "No description provided."}
                      </Text>
                    </Box>

                    <Box className="bottomBar">
                      <Text size="xs" c="dimmed" tt="uppercase">
                        Click to go back
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