import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import * as queries from "../db/queries";

/**
 * Handle an HTTP request to fetch tasks for a project belonging to the authenticated user.
 *
 * @param req - Express request; expects `projectId` in `req.params` and uses Clerk auth from the request
 * @param res - Express response used to send JSON with status codes:
 *              200 with the tasks on success,
 *              401 with `{ error: "Unauthorized" }` if no authenticated user,
 *              500 with `{ error: "Failed to get tasks" }` on failure
 * @returns The HTTP response containing the tasks or an error payload
 */
export async function getTasksByProject(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { projectId } = req.params;
    const tasks = await queries.getTasksByProjectId(String(projectId), userId);

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    return res.status(500).json({ error: "Failed to get tasks" });
  }
}