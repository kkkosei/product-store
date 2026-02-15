import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentTimer, startTimer, stopTimer } from "../lib/api";

export function useTimer() {
  const qc = useQueryClient();

  const current = useQuery({
    queryKey: ["timer", "current"],
    queryFn: getCurrentTimer,
  });

  const start = useMutation({
    mutationFn: (taskId) => startTimer(taskId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer", "current"] });
    },
  });

  const stop = useMutation({
    mutationFn: stopTimer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["timer", "current"] });
    },
  });

  return { current, start, stop };
}
