import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasksByProject, createTask, archiveTask } from "../lib/api";

export function useTasks(projectId) {
  const qc = useQueryClient();

  const tasksQ = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  });

  const createM = useMutation({
    mutationFn: (title) => createTask({ projectId, title }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const archiveM = useMutation({
    mutationFn: (taskId) => archiveTask({ taskId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return {
    tasksQ,
    create: createM,
    archive: archiveM,
  };
}
