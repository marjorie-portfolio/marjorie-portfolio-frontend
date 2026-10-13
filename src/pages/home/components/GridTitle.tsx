import { Text, Flex} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useTheme } from "../../../context/ThemeContext";

export default function GridTitle() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");
  return (
    <Flex direction={"column"} align={"center"} ta={"center"} mt={30} >
      <Text ff={"Bagel Fat One"} fz={mobile? 32 :70} c={colors.text} bg={colors.bgBase} px={30} bdrs={1000}>
        CLICK THE BOXES
      </Text>
        <Text ff={"Bagel Fat One"} fz={mobile? 31:70} c={colors.text} bg={colors.bgBase} px={30} bdrs={1000}>
       TO DISCOVER MORE ABOUT
      </Text>
      <Text ff={"Bagel Fat One"} fz={mobile? 35 :70} c={colors.accPrimary} bg={colors.bgBase} px={30} bdrs={1000}>
        MARJORIE!!!
      </Text>
    </Flex>
  );
}
