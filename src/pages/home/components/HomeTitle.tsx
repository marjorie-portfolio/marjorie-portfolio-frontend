import { Text, Flex } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import { useMediaQuery } from "@mantine/hooks";

export default function HomeTitle() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <Flex direction={"column"}>
      <Flex
        direction="column"
        my={mobile ? 80 : 50}
        align={mobile ? "center" : "flex-start"}
        
        gap={mobile ? 0 : 40}
      >
        <Text
          ff="Climate Crisis"
          c={colors.text}
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 62px)",
          }}
          ta={mobile ? "center" : "left"}
          bg={colors.bgBase}
          px={30}
        >
          FROM IDEAS TO APPLICATION
        </Text>

        {!mobile && (
          <>
            <Text
              ff="Climate Crisis"
              c={colors.bgBase}
              style={{
                WebkitTextStroke: `3px ${colors.accPrimary}`,
                fontSize: "clamp(1rem, 5.5vw, 60px)",
              }}
              bg={colors.bgBase}
              px={30}
            >
              FROM IDEAS TO APPLICATION
            </Text>

            <Text
              ff="Climate Crisis"
              c={colors.bgBase}
              style={{
                WebkitTextStroke: `1px ${colors.text}`,
                fontSize: "clamp(1rem, 5.5vw, 58px)",
              }}
              px={30}
              bg={colors.bgBase}
            >
              FROM IDEAS TO APPLICATION
            </Text>
          </>
        )}
      </Flex>


      <Flex justify="end">
        <Text
          ff="Share Tech Mono"
          style={{
            fontSize: "clamp(1rem, 2vw, 4rem)",
          }}
          c={colors.text}
          ta={mobile ? "center" : "right"}
          bg={colors.bgBase} p={5}
          mr={mobile ? 0 : 50}
        >
          {mobile ? "" : "— "}TRANSFORMING CHALLENGES INTO SOLUTIONS THROUGH CODE.
        </Text>
      </Flex>
    </Flex>
  );
}
