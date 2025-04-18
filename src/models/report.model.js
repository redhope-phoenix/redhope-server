import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
    reportBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    reportOn: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reportReason: {
        type: String,
        default: "Abuse"
    }
}, { timestamps: true })

export const Report = mongoose.model("Report", reportSchema);