import { useQuery } from "@tanstack/react-query";
import { getTasksByProject } from "../lib/api";

export function useTasks(projectId) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
  });
}
