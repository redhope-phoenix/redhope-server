import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    date: {
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
    }
}, { timestamps: true })

export const Request = mongoose.model("Request", requestSchema);