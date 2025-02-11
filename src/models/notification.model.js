import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    actions:{
        type: Array
    }
}, {timestamps: true})

const Notification = mongoose.model("Notification", notificationSchema);
