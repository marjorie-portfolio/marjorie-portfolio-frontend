import { Text, Flex } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import { useMediaQuery } from "@mantine/hooks";
import styles from "./HomeTitle.module.css";

export default function HomeTitle() {
  const { colors } = useTheme();

  const mobile = useMediaQuery("(max-width: 768px)");
  const subtitle = mobile
    ? ""
    : "— TRANSFORMING CHALLENGES INTO SOLUTIONS THROUGH CODE.";
  const subtitleWords = subtitle.split(" ");
  let letterIndex = 0;

  return (
    <Flex direction={"column"} >
      <Flex
        direction="column"
        my={mobile ? 80 : 50}
        gap={mobile ? 0 : 40}
      >
        <Text
          className={styles.firstLine}
          ff="Climate Crisis"
          c={colors.text}
          style={{
            fontSize: "clamp(2.2rem, 5.5vw, 62px)",
          }}
          ta={"center"}
          bg={colors.bgBase}
          px={30}
        >
          FROM IDEAS TO APPLICATION
        </Text>

        {!mobile && (
          <>
            <Text
              className={styles.secondLine}
              ff="Climate Crisis"
              c={colors.accPrimary}
              style={{
                fontSize: "clamp(1rem, 5.5vw, 60px)",
              }}
              ta={"center"}
              bg={colors.bgBase}
              px={30}
            >
              FROM IDEAS TO APPLICATION
            </Text>

            <Text
              className={styles.thirdLine}
              ff="Climate Crisis"
              c={colors.accSecondary}
              style={{
                fontSize: "clamp(1rem, 5.5vw, 58px)",
              }}
              ta={"center"}
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
          aria-label={subtitle}
          ff="Share Tech Mono"
          style={{
            fontSize: "clamp(1rem, 2vw, 2rem)",
          }}
          c={colors.text}
          ta={mobile ? "center" : "right"}
          bg={colors.bgBase} p={5}
          mr={mobile ? 0 : 50}
        >
          <span aria-hidden="true">
            {subtitleWords.map((word, wordIndex) => {
              const wordStartIndex = letterIndex;
              letterIndex += word.length + 1;

              return (
                <span key={wordIndex}>
                  {wordIndex > 0 && " "}
                  <span className={styles.word}>
                    {Array.from(word).map((letter, index) => (
                      <span
                        key={index}
                        className={styles.letter}
                        style={{
                          animationDelay: `${1400 + (wordStartIndex + index) * 30}ms`,
                        }}
                      >
                        {letter}
                      </span>
                    ))}
                  </span>
                </span>
              );
            })}
          </span>
        </Text>
      </Flex>
    </Flex>
  );
}
