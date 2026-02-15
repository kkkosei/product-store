import { Router } from "express";
import { getTasksByProject, postTaskToProject, archiveTaskController } from "../controllers/taskController";

const router = Router();

router.get("/:projectId/tasks", getTasksByProject);
router.post("/:projectId/tasks", postTaskToProject);
router.patch("/tasks/:taskId/archive", archiveTaskController);

export default router;