import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconBrandLinkedin, IconMail } from "@tabler/icons-react";
import { modals } from "@mantine/modals";
import { useTheme } from "../../context/ThemeContext";

/* eslint-disable react-refresh/only-export-components */
export function openContactModal(accPrimary: string) {
  modals.open({
    title: "CONTACT MARJORIE!",
    centered: true,
    size: 600,
    withCloseButton: false,
    styles: {
      content: {
        border: `4px solid ${accPrimary}`,
        borderRadius: "12px",
      },
      header: {
        justifyContent: "center", // Centers the header items horizontally
      },
      title: {
        fontWeight: 700,
        textAlign: "center",      // Centers the title text itself
        width: "100%",  
        color:    `${accPrimary}`       // Ensures the title spans the space to center properly
      },
    },
    children: <ContactModalContent />,
  });
}

function ContactModalContent() {
  const { colors } = useTheme();

  return (
    <Stack align="center" gap="xl" py="md">
      <Text ta="center" fw={600} size="md" c={colors.text}>
        Whether you want to collaborate on a project, hire me, or
        <br />
        just say hi, feel free to reach out!
      </Text>
      <Group gap="xl">
        <ActionIcon
          component="a"
          href="https://www.linkedin.com/in/marjorie-aguarin/"
          target="_blank"
          rel="noreferrer"
          aria-label="Open LinkedIn"
          size={62}
          radius="xl"
          color={colors.accPrimary}
        >
          <IconBrandLinkedin size={32} color="white" />
        </ActionIcon>
        <ActionIcon
          component="a"
          href="https://mail.google.com/mail/?view=cm&fs=1&to=aguarinmarjoriekhate@gmail.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Send an email"
          size={62}
          radius="xl"
          color={colors.accPrimary}
        >
          <IconMail size={32} color="white" />
        </ActionIcon>
      </Group>
    </Stack>
  );
}