import { Router } from "express";
import { getCurrentTimer, startTimer, stopTimer } from "../controllers/timerController";

const router = Router();

router.get("/current", getCurrentTimer);
router.post("/start", startTimer);
router.post("/stop", stopTimer);

export default router;