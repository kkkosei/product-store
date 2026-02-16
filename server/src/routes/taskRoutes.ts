import { Router } from "express";
import { getTasksByProject, postTaskToProject, archiveTaskController, deleteTaskController, deleteArchivedTasksController } from "../controllers/taskController";

const router = Router();

// /api/projects/:projectId/tasks
router.get("/:projectId/tasks", getTasksByProject);
router.post("/:projectId/tasks", postTaskToProject);

export const taskRouter = Router();

// /api/tasks/:taskId/archive
taskRouter.patch("/:taskId/archive", archiveTaskController);
// /api/tasks/archived/all
taskRouter.delete("/archived/all", deleteArchivedTasksController);
// /api/tasks/:taskId
taskRouter.delete("/:taskId", deleteTaskController);

export default router;