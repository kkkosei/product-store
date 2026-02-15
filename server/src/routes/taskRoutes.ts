import { Router } from "express";
import { getTasksByProject } from "../controllers/taskController";

const router = Router();

router.get("/:projectId/tasks", getTasksByProject);

export default router;