import { useEffect } from "react";
import AppRoutes from "./routes";

import { useRestoreSession } from "./hooks/useRestoreSession";

import { useRecordVisit } from "./query/analytics";

function App() {
  useRestoreSession();
const recordVisit = useRecordVisit();
  useEffect(() => {
    recordVisit.mutate()
  }, []);

  return <AppRoutes />;
}

export default App;
