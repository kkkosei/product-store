// client/src/hooks/usePomodoro.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPomodoro, updatePomodoroSettings, startPomodoro, pausePomodoro, resumePomodoro, completePomodoro, switchPomodoroPhase, } from "../lib/api";

export function usePomodoro() {
  const qc = useQueryClient();


  const pomodoroQ = useQuery({
    queryKey: ["pomodoro"],
    queryFn: getPomodoro,
    refetchInterval: 5000,
  });

  const patchSettingsM = useMutation({
    mutationFn: updatePomodoroSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  const startM = useMutation({
    mutationFn: ({ taskId } = {}) => startPomodoro({ taskId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  const pauseM = useMutation({
    mutationFn: pausePomodoro,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  const resumeM = useMutation({
    mutationFn: resumePomodoro,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  const completeM = useMutation({
    mutationFn: completePomodoro,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  const switchM = useMutation({
    mutationFn: ({ phase, taskId } = {}) => switchPomodoroPhase({ phase, taskId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pomodoro"] }),
  });

  return {
    pomodoroQ,
    settings: pomodoroQ.data?.settings ?? null,
    state: pomodoroQ.data?.state ?? null,

    patchSettings: patchSettingsM,
    start: startM,
    pause: pauseM,
    resume: resumeM,
    complete: completeM,
    switchPhase: switchM,
  };
}
