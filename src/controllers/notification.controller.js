import mongoose from "mongoose";
import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const createNotification = async (params) => {
    const { notifiedTo, title, body, actions } = params;
    if (!title || !body) return;
    try {
        await Notification.create({
            notifiedTo,
            title,
            body,
            actions
        })
    } catch (error) {

    }
}

const getUserNotifications = asyncHandler(async (req, res) => {
    const notificationList = await Notification.aggregate([
        {
            $match: {
                notifiedTo: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res.status(200)
        .json(new ApiResponse(200, notificationList, "Notifications fetched"))
})

export { createNotification, getUserNotifications }