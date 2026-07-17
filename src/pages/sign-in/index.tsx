import { Flex, Group } from "@mantine/core";

import PageHeader from "../../components/common/PageHeader";
import SubTitle from "./components/SubTitle";
import SignInDialog from "./components/SignInDialog";

export default function SignIn() {
  return (
    <>
      <Flex align={"center"} direction={"column"} mih="90vh">
        <PageHeader title={"SIGN - IN"} />
        <Flex direction={"column"}  justify={"center"} align={"center"} w={"100%"} flex={1} gap={20}>
          <SubTitle />
          <SignInDialog />{" "}
        </Flex>
      </Flex>
    </>
  );
}
