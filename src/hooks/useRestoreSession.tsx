import { useEffect } from "react";
import { useCurrentUser } from "../query/auth";
import useAuthState from "../store/useAuthStore";

export function useRestoreSession() {
  const { data, isSuccess, isError } = useCurrentUser();
  const { setUser } = useAuthState();

  useEffect(() => {
    if (isSuccess) {
      setUser(data.user);
    }

    if (isError) {
      setUser(null);
    }
  }, [data, isSuccess, isError, setUser]);
}
