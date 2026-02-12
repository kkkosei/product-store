import api from "./axios";

//users api
export const syncUser = async (userData) => {
  const {data} = await api.post("/users/sync", userData);
  return data;
};

//projects api
export const getAllProjects = async () => {
  const {data} = await api.get("/projects");
  return data;
};

export const getProjectById = async (id) => {
  const {data} = await api.get(`/projects/${id}`);
  return data;
};

export const getMyProjects = async () => {
  const {data} = await api.get("/projects/my");
  return data;
};

export const createProject = async (projectData) => {
  const {data} = await api.post("/projects", projectData);
  return data;
};

export const updateProject = async ({id, ...projectData}) => {
  const {data} = await api.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const {data} = await api.delete(`/projects/${id}`);
  return data;
};

//comments api
export const createComment = async ({projectId, content}) => {
  const {data} = await api.post(`/comments/${projectId}`, {content});
  return data;
};

export const deleteComment = async ({commentId}) => {
  const {data} = await api.delete(`/comments/${commentId}`);
  return data;
};
