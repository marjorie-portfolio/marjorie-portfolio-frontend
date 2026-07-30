import { Text, Flex} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useTheme } from "../../../context/ThemeContext";

export default function GridTitle() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Flex direction={"column"} align={"center"} ta={"center"} mt={100}>
      <Text ff={"Bagel Fat One"} w={700} fz={mobile? 40 :70} c={colors.text}>
        CLICK THE IMAGEs
      </Text>
        <Text ff={"Bagel Fat One"} w={800} fz={mobile? 35 :70} c={colors.text}>
       TO KNOW MORE ABOUT
      </Text>
      <Text ff={"Bagel Fat One"} w={700} fz={mobile? 40 :70} c={colors.accPrimary}>
        MARJORIE!!!
      </Text>
    </Flex>
  );
}
