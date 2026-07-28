import { useEffect } from "react"

import AppRoutes from "./routes"

import useAuthState from "./store/useAuthStore"
import { useCurrentUser } from "./query/auth";

function App() {
  const { data, isSuccess } = useCurrentUser();

  const {setUser} = useAuthState()

    useEffect(() => {
    if (isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess, setUser]);
  
  return (
    <AppRoutes/>
  )
}

export default App
