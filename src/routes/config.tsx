
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home";
import SignIn from "../pages/sign-in"
import AboutMe from "../pages/about-me";

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
      }
    ]
  },

];