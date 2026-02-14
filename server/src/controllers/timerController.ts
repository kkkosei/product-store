import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries";

export async function getCurrentTimer(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const session = await queries.getCurrentTimerSession(userId);
    return res.status(200).json(session);
  } catch (error) {
    console.error("Error getting current timer:", error);
    return res.status(500).json({ error: "Failed to get current timer" });
  }
}

export async function startTimer(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { taskId } = req.body;
    if (!taskId) return res.status(400).json({ error: "taskId is required" });

  } catch (e: any) {
    if (e?.message === "A timer session is already running") {
      return res.status(409).json({ error: e.message });
    }
    console.error("Error starting timer:", e);
    return res.status(500).json({ error: "Failed to start timer" });
  }
}

export async function stopTimer(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const running = await queries.getCurrentTimerSession(userId);
    if (!running) return res.status(409).json({ error: "No running timer" });

    const now = new Date();
    const durationSec = Math.max(
      0,
      Math.floor((now.getTime() - new Date(running.startedAt).getTime()) / 1000)
    );

    const stopped = await queries.stopCurrentTimerSession(userId, durationSec);
    return res.status(200).json(stopped);
  } catch (error) {
    console.error("Error stopping timer:", error);
    return res.status(500).json({ error: "Failed to stop timer" });
  }
}