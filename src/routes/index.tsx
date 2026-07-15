import { Routes, Route } from "react-router-dom";
import { routes } from "./config";

function renderRoutes(routes: any[]) {
  return routes.map((route, index) => (
    <Route
      key={route.path || index}
      path={route.path}
      element={route.element}
      index={route.index}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

export default function AppRoutes() {
  return (
    <Routes>
      {renderRoutes(routes)}
    </Routes>
  );
}