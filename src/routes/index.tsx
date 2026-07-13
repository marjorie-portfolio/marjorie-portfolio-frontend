// routes/index.tsx

import { Routes, Route } from "react-router-dom";
import { routes } from "./config";

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
}