import { SimpleGrid, Paper, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export default function GridImage({ data }: { data?: any }) {
  const mobile = useMediaQuery("(max-width: 768px)");
  console.log(data);
  return (
    <Container size="xl" py="xl" w="100%">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Paper p="md" radius="md" style={{ minHeight: mobile? 250 : 400 }}>
            ABOUT ME
          </Paper>
          <Paper p="md" radius="md" style={{ minHeight: 250 }}>
            MY JOURNEY
          </Paper>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <Paper p="md" radius="md" style={{ minHeight: 250 }}>
            SKILLS
          </Paper>
          <Paper p="md" radius="md" style={{ minHeight: 400 }}>
            WORKS
          </Paper>
        </div>
      </SimpleGrid>
    </Container>
  );
}