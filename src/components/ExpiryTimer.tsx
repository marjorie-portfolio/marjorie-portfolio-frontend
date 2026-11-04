import { Badge } from "@mantine/core";
import { useCountdown } from "../hooks/useCountdown";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function ExpiryTimer({ expiresAt }: { expiresAt: string | null }) {
  const remaining = useCountdown(expiresAt);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (remaining === 0) void queryClient.invalidateQueries();
  }, [remaining, queryClient]);
  if (remaining === null) return null;
  const seconds = Math.floor(remaining / 1000);
  return (
    <Badge variant="light">
      {remaining === 0
        ? "00:00"
        : `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60,
          ).padStart(2, "0")}`}
    </Badge>
  );
}
