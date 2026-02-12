import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, getAllProjects, getProjectById, getMyProjects, updateProject } from "../lib/api";

export const useProjects = () => {
  const result = useQuery({ queryKey: ["projects"], queryFn: getAllProjects });
  return result;
};

export const useCreateProject = () => {
  const result = useMutation({ mutationFn: createProject });
  return result;
};

export const useProject = (id) => {
  return useQuery({
    queryKey:["project", id],
    queryFn: () => getProjectById(id),
    enabled: !! id
  }) 
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["myProjects"]})
    }
  });
};

export const useMyProjects = () => {
  return useQuery({ queryKey:["myProjects"], queryFn:getMyProjects })

};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({ 
    mutationFn: updateProject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries( { queryKey: ["projects"] });
      queryClient.invalidateQueries( { queryKey: ["project", variables.id] });
      queryClient.invalidateQueries( { queryKey: ["myProjects"] });
    },
  });
};