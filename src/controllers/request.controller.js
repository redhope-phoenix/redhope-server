import mongoose from "mongoose";
import { Request } from "../models/request.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { Help } from "../models/help.model.js";
import { createNotification } from "./notification.controller.js";

// creates a new request
const createRequest = asyncHandler(async (req, res) => {
    const { requestedBy, phoneNo, date, address, pincode, reason, bloodGroup, applicant } = req.body;
    if ([requestedBy, phoneNo, date, address, pincode, bloodGroup, applicant].some(e => e === "")) throw new ApiError(400, "All fields are required");
    const request = await Request.create({
        requestedBy, phoneNo, date, address, pincode, reason, bloodGroup, applicant
    });

    return res.status(200)
        .json(new ApiResponse(200, { id: request?._id }, "request created"))
})
// creates a request report
const createRequestReport = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const existedReport = await Report.findOne({ reportOn: requestId, reportBy: req.user._id });
    if (existedReport) throw new ApiError(402, "Report already created");

    const request = await Request.findById(requestId);
    if (!request) throw new ApiError(400, "request not found");

    Report.create({
        reportBy: req.user._id,
        reportOn: requestId
    })

    request.report = request.report + 1;

    if (request.report >= 10) {
        request.isActive = false;
    }
    await request.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "Report created"));
})

// get request
const getUserRequests = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const requestList = await Request.aggregate([
        {
            $match: {
                requestedBy: new mongoose.Types.ObjectId(userId)
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
        .json(new ApiResponse(200, requestList, "Requests fetched"))
})

const getRequestById = asyncHandler(async (req, res) => {
    const { requestId, userId } = req.query;
    if (!requestId) throw new ApiError(400, "Request id is required");
    const request = await Request.findById(requestId);

    if (!request || (userId !== request?.requestedBy && !request.isActive)) throw new ApiError(402, "Request not found");

    return res.status(200)
        .json(new ApiResponse(200, request, "Request fetched"))
})

// request modifications
const fulfillRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    await Request.findByIdAndUpdate(requestId, {
        $set: {
            isFulfilled: true,
            isActive: false
        }
    }, { new: true })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Request fulfilled"))
})

const deactiveRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;

    await Request.findByIdAndUpdate(requestId, {
        $set: {
            isActive: false
        }
    }, { new: true })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Request deactivated"))
})

// helping on request
const helpOnRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.body;
    const user = await User.findById(req.user._id);
    const request = await Request.findById(requestId);
    if (!request || !request.isActive) throw new ApiError(400, "Request does not exist or not active");
    await Help.create({
        requestId,
        helperId: user._id,
        helperContactInfo: {
            phoneNo: user.phoneNo,
            email: user.email,
            address: user.address,
            pincode: user.pincode
        }
    });

    await createNotification({
        notifiedTo: request.requestedBy,
        title: "Help"
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, "Help created"))
})

export {
    createRequest,
    createRequestReport,
    getUserRequests,
    getRequestById,
    fulfillRequest,
    deactiveRequest,
    helpOnRequest
}