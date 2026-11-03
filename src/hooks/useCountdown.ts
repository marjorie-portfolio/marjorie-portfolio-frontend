import { useEffect, useState } from "react";

export function useCountdown(expiresAt: string | null): number | null {
  const getRemaining = () => expiresAt ? Math.max(0, new Date(expiresAt).getTime() - Date.now()) : null;
  const [remaining, setRemaining] = useState<number | null>(getRemaining);
  useEffect(() => {
    setRemaining(getRemaining());
    if (!expiresAt) return;
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  return remaining;
}
