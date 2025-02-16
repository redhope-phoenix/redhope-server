import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createCampaign, createCampaignReport, getCampaignById, getCampaignFeed, getUserCampaigns, removeCampaign } from "../controllers/campaign.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-campaign").post(verifyJwt, upload.single("leaflet"), createCampaign);
router.route("/campaign-report/:campaignId").post(verifyJwt, createCampaignReport);
router.route("/user-campaigns").get(verifyJwt, getUserCampaigns);
router.route("/get-campaign/:campaignId").get(getCampaignById);
router.route("/remove-campaign/:campaignId").get(verifyJwt, removeCampaign);

router.route("/campaign-feed").get(getCampaignFeed);

export default router;