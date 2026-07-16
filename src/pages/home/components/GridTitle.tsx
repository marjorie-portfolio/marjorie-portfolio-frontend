import { Text, Flex} from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";

export default function GridTitle() {
  const { colors } = useTheme();
  return (
    <Flex direction={"column"} align={"center"} ta={"center"} mt={100}>
      <Text ff={"Bagel Fat One"} w={700} fz={70} c={colors.text}>
        CLICK THE IMAGEs
      </Text>
        <Text ff={"Bagel Fat One"} w={800} fz={70} c={colors.text}>
       TO KNOW MORE ABOUT
      </Text>
      <Text ff={"Bagel Fat One"} w={700} fz={70} c={colors.accPrimary}>
        MARJORIE!!!
      </Text>
    </Flex>
  );
}
