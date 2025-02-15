import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    contactNo: {
        type: String
    },
    coverImage: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    report: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const Campaign = mongoose.model("Campaign", campaignSchema);