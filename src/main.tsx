import "../src/assets/fonts.css";
import "@mantine/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AppProvider from "./provider/AppProvider.tsx";
import App from "./App.tsx";
import { mantineTheme } from "./theme/mantine";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <BrowserRouter>
        <StrictMode>
          <MantineProvider theme={mantineTheme}>
            <ModalsProvider>
              <Notifications />
              <App />
            </ModalsProvider>
          </MantineProvider>
        </StrictMode>
      </BrowserRouter>
    </AppProvider>
  </QueryClientProvider>,
);
