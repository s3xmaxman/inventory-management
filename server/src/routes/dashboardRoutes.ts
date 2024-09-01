import { Router } from "express";
import { getDashBoardMetrics } from "../controllers/dashboardController";

const router = Router();

router.get("/", getDashBoardMetrics);

export default router;
