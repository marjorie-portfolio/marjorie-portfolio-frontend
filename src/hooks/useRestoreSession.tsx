import { useEffect } from "react";
import { useCurrentUser } from "../query/auth";
import useAuthState from "../store/useAuthStore";

export function useRestoreSession() {
  const { data, isPending, isSuccess, isError } = useCurrentUser();
  const { setUser, setSessionRestored } = useAuthState();

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (isSuccess) {
      setUser(data.user ?? null);
    }

    if (isError) {
      setUser(null);
    }

    setSessionRestored();
  }, [
    data,
    isPending,
    isSuccess,
    isError,
    setUser,
    setSessionRestored,
  ]);
}
