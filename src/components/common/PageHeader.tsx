import { Text, ActionIcon, Box } from "@mantine/core";
import { IconArrowBigLeftFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../../context/ThemeContext";

type PageHeaderProps = {
  title: string;
};

export default function PageHeader({ title }: PageHeaderProps) {
  const { colors } = useTheme();
  const navigate = useNavigate();

  return (
    <Box
    w={"90%"}
      h={70}
      pos="relative"
      bg={colors.bgBase}
      my={20}
    >
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
        <IconArrowBigLeftFilled color={colors.accPrimary}  size={35}/>
      </ActionIcon>

      <Text
        ta="center"
        ff="Climate Crisis"
        c={colors.accPrimary}
        fz={45}
      >
        {title}
      </Text>
    </Box>
  );
}