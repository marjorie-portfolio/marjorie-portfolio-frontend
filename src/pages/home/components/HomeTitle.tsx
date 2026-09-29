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
          fz={83}
          ta={mobile ? "center" : "left"}
        >
          FROM IDEAS TO APPLICATION
        </Text>

        {!mobile && (
          <>
            <Text
              ff="Climate Crisis"
              c={colors.bgBase}
              lh={1.6}
              fz={78}
              style={{
                WebkitTextStroke: `3px ${colors.accPrimary}`,
              }}
            >
              FROM IDEAS TO APPLICATION
            </Text>

            <Text
              ff="Climate Crisis"
              c={colors.bgBase}
              lh={1.6}
              fz={73}
              style={{
                WebkitTextStroke: `1px ${colors.text}`,
              }}
            >
              FROM IDEAS TO APPLICATION
            </Text>
          </>
        )}
      </Flex>


      <Flex justify="end" w={mobile ? 300 : "100%"}>
        <Text
          ff="Share Tech Mono"
          style={{
            fontSize: "clamp(1rem, 2vw, 4.4rem)",
          }}
          c={colors.text}
          ta="right"
          maw={mobile ? "100%" : 700}
        >
          — TRANSFORMING CHALLENGES INTO SOLUTIONS THROUGH CODE.
        </Text>
      </Flex>
    </>
  );
}
