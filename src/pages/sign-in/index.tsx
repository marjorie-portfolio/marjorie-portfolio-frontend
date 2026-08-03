import { Flex, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import PageHeader from "../../components/common/PageHeader";
import SubTitle from "./components/SubTitle";
import SignInDialog from "./components/SignInDialog";

export default function SignIn() {
  const mobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Flex align={"center"} direction={"column"} mih="90vh">
        <PageHeader title={"SIGN - IN"} />
        <Flex
          direction={"column"}
          justify={"center"}
          align={"center"}
          w={"100%"}
          flex={1}
          gap={20}
        >
          <SubTitle mobile={mobile}/>
          <SignInDialog mobile={mobile}/>
        </Flex>
      </Flex>
    </>
  );
}
