import mongoose from "mongoose";
import { Campaign } from "../models/campaign.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Report } from "../models/report.model.js";

const createCampaign = asyncHandler(async (req, res) => {
    const { title, category, description, time, date, address, pincode, contactNo } = req.body;
    if ([title, category, time, date, address, pincode].some(e => e === "")) throw new ApiError(400, "All fields are required");

    await Campaign.create({
        userId: req.user._id,
        title,
        description,
        category,
        address,
        contactNo,
        time,
        date,
        pincode
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Campaign created"))
})

const createCampaignReport = asyncHandler(async (req, res) => {
    const { campaignId } = req.body;
    const existedReport = await Report.findOne({ reportOn: campaignId, reportBy: req.user._id });
    if (existedReport) throw new ApiError(402, "Report already created");
    const campaign = await Campaign.findById();
    if (!campaign) throw new ApiError(400, "Campaign not found");

    Report.create({
        reportBy: req.user._id,
        reportOn: campaignId
    })
    campaign.report = campaign.report + 1;

    if (campaign.report >= 10) {
        campaign.isActive = false;
    }
    await campaign.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "Report created"));
})

const getUserCampaigns = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const campaignList = await Campaign.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res.status(200)
        .json(new ApiResponse(200, campaignList, "Campaign fetched"))
})

export {
    createCampaign,
    createCampaignReport,
    getUserCampaigns
}