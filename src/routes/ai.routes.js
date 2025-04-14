import { Router } from "express";
import { healthAiService } from "../controllers/healthAi.controller.js";

const router = Router();

router.route("/get-health-ai-response").get(healthAiService);

export default router;