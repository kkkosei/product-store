import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasksByProject, createTask, archiveTask, deleteTask, deleteArchivedTasksAll } from "../lib/api";

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
      qc.invalidateQueries({ queryKey: ["project", projectId, "summary"] });
      qc.invalidateQueries({ queryKey: ["me", "summary"] });
    },
  });

  const archiveM = useMutation({
    mutationFn: (taskId) => archiveTask({ taskId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId, "summary"] });
      qc.invalidateQueries({ queryKey: ["me", "summary"] });
    },
  });

  const deleteM = useMutation({
    mutationFn: (taskId) => deleteTask({ taskId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId, "summary"] });
      qc.invalidateQueries({ queryKey: ["me", "summary"] });
    },
  });

  const deleteArchivedAllM = useMutation({
    mutationFn: () => deleteArchivedTasksAll(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", projectId] });
      qc.invalidateQueries({ queryKey: ["project", projectId, "summary"] });
      qc.invalidateQueries({ queryKey: ["me", "summary"] });
    },
  });

  return {
    tasksQ,
    create: createM,
    archive: archiveM,
    delete: deleteM,
    deleteArchivedAll: deleteArchivedAllM,
  };
}
