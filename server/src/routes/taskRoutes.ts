import { Router } from "express";
import { getTasksByProject, postTaskToProject, archiveTaskController } from "../controllers/taskController";

const router = Router();

// /api/projects/:projectId/tasks
router.get("/:projectId/tasks", getTasksByProject);
router.post("/:projectId/tasks", postTaskToProject);

export const taskRouter = Router();

// /api/tasks/:taskId/archive
taskRouter.patch("/:taskId/archive", archiveTaskController);

export default router;