// server/src/controllers/pomodoroController.ts
import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as pomodoroService from "../services/pomodoroService";

export async function getPomodoro(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const bundle = await pomodoroService.getBundle(userId);
    return res.status(200).json(bundle);
  } catch (e) {
    console.error("getPomodoro error:", e);
    return res.status(500).json({ error: "Failed to get pomodoro" });
  }
}

export async function patchPomodoroSettings(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const data = req.body ?? {};

    // light guard (keep it simple; you can tighten later with zod)
    const allowedKeys = new Set([
      "workSec",
      "breakSec",
      "longBreakSec",
      "longBreakEvery",
      "autoStartNext",
    ]);

    for (const k of Object.keys(data)) {
      if (!allowedKeys.has(k)) {
        return res.status(400).json({ error: `Unknown field: ${k}` });
      }
    }

    const updated = await pomodoroService.updateSettings(userId, data);
    return res.status(200).json(updated);
  } catch (e) {
    console.error("patchPomodoroSettings error:", e);
    return res.status(500).json({ error: "Failed to update pomodoro settings" });
  }
}

export async function startPomodoro(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.body ?? {};
    const state = await pomodoroService.start(userId, taskId);
    return res.status(200).json(state);
  } catch (e: any) {
    const msg = e?.message ?? "Failed to start pomodoro";
    if (msg.includes("taskId is required")) return res.status(400).json({ error: msg });
    if (msg === "Task not found") return res.status(404).json({ error: msg });
    console.error("startPomodoro error:", e);
    return res.status(500).json({ error: "Failed to start pomodoro" });
  }
}

export async function pausePomodoro(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const state = await pomodoroService.pause(userId);
    return res.status(200).json(state);
  } catch (e) {
    console.error("pausePomodoro error:", e);
    return res.status(500).json({ error: "Failed to pause pomodoro" });
  }
}

export async function resumePomodoro(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const state = await pomodoroService.resume(userId);
    return res.status(200).json(state);
  } catch (e) {
    console.error("resumePomodoro error:", e);
    return res.status(500).json({ error: "Failed to resume pomodoro" });
  }
}

export async function completePomodoro(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const state = await pomodoroService.complete(userId);
    return res.status(200).json(state);
  } catch (e: any) {
    const msg = e?.message ?? "Failed to complete pomodoro";
    if (msg === "Pomodoro is not running") return res.status(409).json({ error: msg });
    if (msg === "Task not found") return res.status(404).json({ error: msg });
    console.error("completePomodoro error:", e);
    return res.status(500).json({ error: "Failed to complete pomodoro" });
  }
}

export async function switchPomodoroPhase(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { phase, taskId } = req.body ?? {};
    if (!phase) return res.status(400).json({ error: "phase is required" });

    const state = await pomodoroService.switchPhase(userId, phase, taskId);
    return res.status(200).json(state);
  } catch (e: any) {
    const msg = e?.message ?? "Failed to switch phase";
    if (msg.startsWith("Invalid phase")) return res.status(400).json({ error: msg });
    if (msg.includes("taskId is required")) return res.status(400).json({ error: msg });
    if (msg === "Task not found") return res.status(404).json({ error: msg });
    console.error("switchPomodoroPhase error:", e);
    return res.status(500).json({ error: "Failed to switch phase" });
  }
}
