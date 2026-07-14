import { useContext } from "react"
import { Box, Text } from "@mantine/core"
import { ThemeContext } from "../../context/ThemeContext"

export default function Home(){
    const theme = useContext(ThemeContext)
    console.log("khate", theme)
    return(
        <Box bg={theme?.colors.bgBase} h={100} w={100}>
            <Text c={theme?.colors.text}>Home</Text>
        </Box>
    )
}