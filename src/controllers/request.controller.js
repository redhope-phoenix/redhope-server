import mongoose, { mongo } from "mongoose";
import { Request } from "../models/request.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Report } from "../models/report.model.js";
import { ApiError } from "../utils/api-error.js";
import { User } from "../models/user.model.js";
import { Help } from "../models/help.model.js";
import { createNotification } from "./notification.controller.js";
import { sendNodeEmail } from "../utils/send-email.js";
import { donationRequirementMail, requestedUserNotifMail } from "../utils/html.js";

// creates a new request
const createRequest = asyncHandler(async (req, res) => {
    const { requestedBy, phoneNo, date, address, pincode, reason, bloodGroup, applicant } = req.body;
    if ([requestedBy, phoneNo, date, address, pincode, bloodGroup, applicant].some(e => e === "")) throw new ApiError(400, "All fields are required");
    const request = await Request.create({
        requestedBy, phoneNo, date, address, pincode, reason, bloodGroup, applicant
    });

    // alerts others
    let alertPincodeList = [];
    for (let i = -2; i < 3; i++)alertPincodeList.push(String(Number(pincode) + i));

    let bloodGroupList = [];
    if (bloodGroup === "AB+") bloodGroupList = ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"];
    else if (bloodGroup === "AB-") bloodGroupList = ["A-", "B-", "AB-", "O-"];
    else if (bloodGroup[1] === "+") bloodGroupList = [bloodGroup, `${bloodGroup[0]}-`, `O${bloodGroup[1]}`, "O-"];
    else if (bloodGroup[1] === "-") bloodGroupList = [bloodGroup, "O-"];
    else bloodGroupList = [bloodGroup];

    const bloodGroupObjList = bloodGroupList.map(e => ({ bloodGroup: e }));

    const alertUserList = await User.aggregate([
        {
            $match: {
                $and: [
                    { pincode: { $in: alertPincodeList } },
                    { bloodGroup: { $in: bloodGroupList } }
                ],
                isBloodGroupAdded: true
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

    // notify users
    alertUserList?.forEach(async (user) => {
        if (user?._id !== req.user._id) {
            // sends notifications
            await createNotification({
                title: "Urgent blood donation required",
                body: `An urgent blood donation required in your locality. ${applicant} needs an urgent donation. Try to help him/her.`,
                actions: [
                    {
                        name: `Help ${applicant}`,
                        nvaigate: `/request/${request?._id}`
                    }
                ]
            });

            await sendNodeEmail({
                mailTo: user?.email,
                subject: "Blood requirement alert from Redhope",
                html: donationRequirementMail({
                    userName: user?.userName,
                    bloodGroup: bloodGroup,
                    address: `${address?.addressLine}, ${address?.district},${address.state} - ${pincode}`,
                    phoneNo: phoneNo,
                    navigate: `${process.env.CORS_ORIGIN}/request/${request?._id}`
                })
            })

        }
    });

    request.reachedTo = alertUserList?.length;
    request.save({ validateBeforeSave: false })

    return res.status(200)
        .json(new ApiResponse(200, { id: request?._id }, "request created"))
})

// creates a request report
const createRequestReport = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
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
    const { requestId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user?.isContactInfoFilled || !user?.isBloodGroupAdded) throw new ApiError(403, "profile is not Complete")
    const request = await Request.findById(requestId);
    if (!request || !request.isActive) throw new ApiError(400, "Request does not exist or not active");
    const existedHelp = await Help.findOne({ requestId, helperId: user._id });
    if (existedHelp) throw new ApiError(402, "Help already exists");
    await Help.create({
        requestId,
        helperId: user._id,
        helperDetails: {
            userName: user.userName,
            bloodGroup: user.bloodGroup,
            avatar: user.avatar
        },
        helperContactInfo: {
            phoneNo: user.phoneNo,
            email: user.email,
            address: user.address,
            pincode: user.pincode
        }
    });

    await createNotification({
        notifiedTo: request.requestedBy,
        title: "Helping alert for your request",
        body: `${user.userName} wants to help you for your blood donation request of request id - ${requestId}`,
        actions: [{
            name: "View details",
            navigate: `/request/${requestId}`
        }]
    })

    const requestedByUser = await User.findById(request?.requestedBy);

    await sendNodeEmail({
        mailTo: requestedByUser?.email,
        subject: "Donor found for donation",
        html: requestedUserNotifMail({
            userName: requestedByUser?.userName,
            donorName: user?.userName,
            address: `${user?.address?.addressLine}, ${user?.address?.district},${user?.address.state} - ${user?.pincode}`,
            bloodGroup: user?.bloodGroup,
            donorContact: user?.phoneNo,
            navigate: `${process.env.CORS_ORIGIN}/request/${request?._id}`
        })

    })

    request.approvedBy = request.approvedBy + 1;
    request.save({ validateBeforeSave: false });

    return res.status(200)
        .json(new ApiResponse(200, {}, "Help created"))
})

// get request helps
const getRequestHelps = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const helpList = await Help.aggregate([
        {
            $match: {
                requestId: new mongoose.Types.ObjectId(requestId)
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        }
    ])

    return res.status(200)
        .json(new ApiResponse(200, helpList, "Help list fetched"));
})

export {
    createRequest,
    createRequestReport,
    getUserRequests,
    getRequestById,
    fulfillRequest,
    deactiveRequest,
    helpOnRequest,
    getRequestHelps
}