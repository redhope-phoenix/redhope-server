import mongoose, { Schema } from "mongoose";

const helpSchema = new Schema({
    requestId: {
        type: mongoose.Types.ObjectId,
        ref: "Request",
        required: true
    },
    helperId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    helperDetails: {
        type: Object
    },
    helperContactInfo: {
        type: Object
    }
}, { timestamps: true })

export const Help = mongoose.model("Help", helpSchema);