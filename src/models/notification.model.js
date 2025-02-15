import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    notifiedTo: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    actions: {
        type: Array
    }
}, { timestamps: true })

export const Notification = mongoose.model("Notification", notificationSchema);
