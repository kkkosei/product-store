import { useQuery } from "@tanstack/react-query";
import { getProjectSummary } from "../lib/api";

export const useProjectSummary = (projectId) => {
  return useQuery({
    queryKey: ["projectSummary", projectId],
    queryFn: () => getProjectSummary(projectId),
    enabled: !!projectId,
  });
};
