import { useEffect } from "react";
import { socket } from "../socket";
import { useQueryClient } from "@tanstack/react-query";

export const useVisits = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("VISITS HOOK MOUNTED:", socket.id);

    const handleVisitsUpdated = (data: { visits: number }) => {
      console.log("VISITS EVENT RECEIVED:", data);

      queryClient.invalidateQueries({
        queryKey: ["visits"],
      });
    };

    socket.on("visits-updated", handleVisitsUpdated);

    return () => {
      socket.off("visits-updated", handleVisitsUpdated);
    };
  }, [queryClient]);
};