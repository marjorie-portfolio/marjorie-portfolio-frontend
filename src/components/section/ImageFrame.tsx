import { Box, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

type ImageFrameProps = {
  src?: string | null;
  ratio: number;
};

export default function ImageFrame({ src, ratio }: ImageFrameProps) {
  const { colors } = useTheme();
  const [broken, setBroken] = useState(false);
  const [naturalRatio, setNaturalRatio] = useState(ratio);

  useEffect(() => {
    setBroken(false);
    setNaturalRatio(ratio);
  }, [src, ratio]);

  return (
    <Box
      w="100%"
      bg={colors.bgHighlight}
      style={{
        aspectRatio: `${naturalRatio}`,
        maxHeight: "min(420px, 70vh)",
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {src && !broken ? (
        <Image
          src={src}
          alt=""
          fit="contain"
          h="100%"
          w="100%"
          loading="lazy"
          onLoad={(event) => {
            const image = event.currentTarget;
            if (image.naturalWidth > 0 && image.naturalHeight > 0) {
              setNaturalRatio(image.naturalWidth / image.naturalHeight);
            }
          }}
          onError={() => setBroken(true)}
        />
      ) : (
        <Box bg={colors.bgHighlight} h="100%" />
      )}
    </Box>
  );
}
