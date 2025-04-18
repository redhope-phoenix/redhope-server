import mongoose from "mongoose";
import { Campaign } from "../models/campaign.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Report } from "../models/report.model.js";
import { uploadOnClodinary } from "../utils/cloudinary-connects.js";
import { User } from "../models/user.model.js";
import { createNotification } from "./notification.controller.js";
import { sendNodeEmail } from "../utils/send-email.js";
import { campaignAwarnessMail } from "../utils/html.js";
import { formatDate } from "../utils/date-converter.js";

const createCampaign = asyncHandler(async (req, res) => {
    const { title, category, description, time, date, address, pincode, contactNo, registrationLink } = req.body;
    if ([title, category, date, address, pincode].some(e => e === "")) throw new ApiError(400, "All fields are required");

    const leafletFile = req.file?.path;
    if (!leafletFile) throw new ApiError(400, "Leaflet is required");
    const leaflet = await uploadOnClodinary(leafletFile);

    const campaign = await Campaign.create({
        userId: req.user._id,
        title,
        description,
        category,
        address,
        contactNo,
        time,
        date,
        pincode,
        registrationLink,
        leaflet: leaflet?.url || ""
    });

    // awareness notifications
    let pincodeList = [];
    for (let i = -4; i < 5; i++)pincodeList.push({ pincode: String(Number(pincode) + i) });

    const userList = await User.aggregate([
        {
            $match: {
                $or: pincodeList
            }
        },
        {
            $project: {
                _id: 1,
                userName: 1,
                email: 1
            }
        }
    ]);

    userList?.forEach(async (user) => {
        if (user?._id !== req.user._id) {
            await createNotification({
                title: "Health campaign in your locality",
                body: "We are excited to invite you to a Health & Wellness Campaign happening near you! Take part in health checkups, expert consultations, and awareness sessions to promote a healthier lifestyle.",
                actions: [{
                    name: "View camp details",
                    navigate: `/campaign/${campaign?._id}`
                }]
            });

            await sendNodeEmail({
                mailTo: user?.email,
                subject: "Health awareness camp in your locality",
                html: campaignAwarnessMail({
                    userName: user?.userName,
                    address: `${address?.addressLine}, ${address?.district},${address.state} - ${pincode}`,
                    date: formatDate(date)?.formattedDate,
                    time: formatDate(date)?.formattedTime,
                    navigate: `${process.env.CORS_ORIGIN}/campaign/${campaign?._id}`
                })
            })
        }
    })

    return res.status(200)
        .json(new ApiResponse(200, { id: campaign?._id }, "Campaign created"))
})

const createCampaignReport = asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    const existedReport = await Report.findOne({ reportOn: campaignId, reportBy: req.user._id });
    if (existedReport) throw new ApiError(402, "Report already created");
    const campaign = await Campaign.findById(campaignId);
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
                isActive: -1,
                createdAt: -1
            }
        }
    ]);

    return res.status(200)
        .json(new ApiResponse(200, campaignList, "Campaign fetched"))
})

const getCampaignById = asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    if (!campaignId) throw new ApiError(400, "campaign Id is required");
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || !campaign?.isActive) throw new ApiError(402, "Doesn't find campaign ");

    return res.status(200)
        .json(new ApiResponse(200, campaign, "Campaign fetched"))

})

const removeCampaign = asyncHandler(async (req, res) => {
    const { campaignId } = req.params;
    if (!campaignId) throw new ApiError(400, "campaign id is required");
    const campaign = await Campaign.findById(campaignId);
    // if (campaign?.userId !== req.user._id) throw new ApiError(402, "Unknown request");

    await Campaign.findByIdAndDelete(campaignId);

    return res.status(200)
        .json(new ApiResponse(200, {}, "campaign removed"))
})

// get campaign feeds
const getCampaignFeed = asyncHandler(async (req, res) => {
    const { pincode, filter } = req.query;

    // filter by nearest pincodes
    let pincodeList = [];
    for (let i = -4; i < 5; i++)pincodeList.push({ pincode: String(Number(pincode) + i) });

    let matches = { isActive: true };
    if (filter === "pincode" && pincode) {
        matches = {
            ...matches,
            $or: pincodeList
        }
    }

    const campaignList = await Campaign.aggregate([
        {
            $match: matches

        },
        {
            $sort: {
                date: 1
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, campaignList, "Campaigns fetched"))
})

export {
    createCampaign,
    createCampaignReport,
    getUserCampaigns,
    getCampaignById,
    removeCampaign,
    getCampaignFeed
}