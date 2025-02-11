import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
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
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    contactNo: {
        type: Number
    },
    coverImage: {
        type: String
    }
}, { timestamps: true })

export const Campaign = mongoose.model("Campaign", campaignSchema);