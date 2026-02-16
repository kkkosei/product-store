// server/src/routes/pomodoroRoutes.ts
import { Router } from "express";
import {
  getPomodoro,
  patchPomodoroSettings,
  startPomodoro,
  pausePomodoro,
  resumePomodoro,
  completePomodoro,
  switchPomodoroPhase,
} from "../controllers/pomodoroController";

const router = Router();

// GET bundle (settings + state)
router.get("/", getPomodoro);

// PATCH settings
router.patch("/settings", patchPomodoroSettings);

// Actions
router.post("/start", startPomodoro);
router.post("/pause", pausePomodoro);
router.post("/resume", resumePomodoro);
router.post("/complete", completePomodoro);

// { phase: "work" | "break" | "longbreak", taskId?: string }
router.post("/switch", switchPomodoroPhase);

export default router;
