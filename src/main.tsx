import "../src/assets/fonts.css"
import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import AppProvider from "./provider/AppProvider.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <BrowserRouter>
      <StrictMode>
        <MantineProvider theme={{
          fontFamily: "Poppins",
        }}>
          <App />
        </MantineProvider>
      </StrictMode>
    </BrowserRouter>
  </AppProvider>,
);
