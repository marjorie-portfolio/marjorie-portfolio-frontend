import { Outlet } from "react-router-dom";
import { AppShell } from "@mantine/core";

export default function Main() {
  return <AppShell.Main px="md"><Outlet/></AppShell.Main>;
}
