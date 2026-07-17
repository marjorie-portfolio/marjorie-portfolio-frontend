import {Text, Flex} from "@mantine/core"

import { useTheme } from "../../../context/ThemeContext"

export default function SubTitle(){

    const {colors} = useTheme()

    return(
        <>
         <Flex p={10} bg={colors.bgBase} align={"center"} justify={"center"} w={"35%"}>
            <Text c={colors.accPrimary} fw={700} fz={23}>Your journey evolves—</Text>
            <Text c={colors.text} fw={500} fz={20}>update your portfolio anytime.</Text>
        </Flex></>
    )
}