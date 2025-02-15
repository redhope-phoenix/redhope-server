import { Notification } from "../models/notification.model.js";
import { ApiResponse } from "../utils/api-response.js";

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

export { createNotification }