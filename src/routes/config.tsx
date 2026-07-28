import ProtectedRoute from "./protectedRoute";


import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home";
import SignIn from "../pages/sign-in"
import AboutMe from "../pages/about-me";

import DashBoard from "../pages/dashboard";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "/about-me",
        element: <AboutMe/>
      },
      {
        path: "/sign-in",
        element:  <SignIn/>
      },
      {
        element: <ProtectedRoute/>,
        children: [
          {
             path: "/dashboard",
        element:  <DashBoard/>
          }
        ]
      }
    ]
  },

];