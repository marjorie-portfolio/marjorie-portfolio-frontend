import { Text, Flex } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import { useMediaQuery } from "@mantine/hooks";

export default function HomeTitle() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <>
      <Flex
        direction="column"
        my={mobile ? 80 : 50}
        align={mobile ? "center" : "flex-start"}
      >
        <Text
          ff="Climate Crisis"
          c={colors.text}
          style={{
            fontSize: "clamp(2rem, 4vw, 5rem)", // max 80px
          }}
          ta={mobile ? "center" : "left"}
        >
          FROM IDEAS TO APPLICATION
        </Text>

        {!mobile && (
          <>
            <Text
              ff="Climate Crisis"
              c={colors.text}
              style={{
                fontSize: "clamp(2.25rem, 3.5vw, 4.7rem)", // max 75px
              }}
            >
              FROM IDEAS TO APPLICATION
            </Text>

            <Text
              ff="Climate Crisis"
              c={colors.text}
              style={{
                fontSize: "clamp(2rem, 3vw, 4.4rem)", // max 70px
              }}
            >
              FROM IDEAS TO APPLICATION
            </Text>
          </>
        )}
      </Flex>
  

      <Flex justify="end" w={mobile? 300 : "100%"}>
        <Text
          ff="Share Tech Mono"
          style={{
            fontSize: "clamp(1rem, 2vw, 4.4rem)",
          }}
          c={colors.text}
          ta="right"
          maw={mobile ? "100%" : 700}
        >
          — transforming challenges into solutions through code.
        </Text>
      </Flex>
    </>
  );
}
