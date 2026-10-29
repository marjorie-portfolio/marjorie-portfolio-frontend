import ProtectedRoute from "./protectedRoute";

import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home";
import SignIn from "../pages/sign-in";

import DashBoard from "../pages/dashboard";
import Section from "../pages/sections";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <DashBoard />,
          },
          {
            path: "/section/:slug/:id",
            element: <Section />,
          },
        ],
      },
    ],
  },
];
