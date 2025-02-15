import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createCampaign, createCampaignReport, getUserCampaigns } from "../controllers/campaign.controller.js";

const router = Router();

router.route("/create-campaign").post(verifyJwt, createCampaign);
router.route("/campaign-report").post(verifyJwt, createCampaignReport);
router.route("/user-campaigns").get(verifyJwt, getUserCampaigns);

export default router;