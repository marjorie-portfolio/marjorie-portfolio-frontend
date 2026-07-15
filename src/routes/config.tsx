
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/home/index";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home/>
      }
    ]
  },

];