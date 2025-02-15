import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    applicant: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    bloodGroup: {
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
    isActive: {
        type: Boolean,
        default: true
    },
    isFulfilled: {
        type: Boolean,
        default: false
    },
    reachedTo: {
        type: Number,
        default: 0
    },
    approvedBy: {
        type: Number,
        default: 0
    },
    report: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

export const Request = mongoose.model("Request", requestSchema);