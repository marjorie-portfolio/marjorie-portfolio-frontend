import { Text, ActionIcon, Box, Group } from "@mantine/core";
import type { ReactNode } from "react";
import { IconArrowBigLeftFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

import { useTheme } from "../../context/ThemeContext";

type PageHeaderProps = {
  title: ReactNode;
  hideBackButton?: boolean;
  action?: ReactNode;
  uppercase?: boolean;
};

export default function PageHeader({
  title,
  hideBackButton = false,
  action,
  uppercase = true,
}: PageHeaderProps) {
  const { colors } = useTheme();
  const navigate = useNavigate();

    const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <Box w={"90%"} h={mobile? 35 : 70} pos="relative" bg={colors.bgBase} my={20}>
      {(
        !hideBackButton &&
        <ActionIcon
          pos="absolute"
          left={15}
          top="50%"
          style={{ transform: "translateY(-50%)" }}
          variant="filled"
          color={colors.bgBase}
          size="xl"
          onClick={() => navigate(-1)}
        >
          <IconArrowBigLeftFilled color={colors.accPrimary} size={mobile? 20: 35} />
        </ActionIcon>
      )}

      <Group justify="center" h="100%" px="md">
        <Text ta="center" ff="Climate Crisis" c={colors.accPrimary} fz={mobile? 20 :45}>
          <span style={{ textTransform: uppercase ? "uppercase" : "none" }}>{title}</span>
        </Text>
        {action}
      </Group>
    </Box>
  );
}
