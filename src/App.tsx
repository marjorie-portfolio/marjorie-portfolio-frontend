import AppRoutes from "./routes";

import { useRestoreSession } from "./hooks/useRestoreSession";

function App() {
  useRestoreSession();

  return <AppRoutes />;
}

export default App;
