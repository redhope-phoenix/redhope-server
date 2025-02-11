import mongoose from "mongoose";
import bcrypt from "bcrypt"
import { sendSms } from "../utils/sms-service";

const otpSchema = new mongoose.Schema({
    phoneNo: {
        type: Number,
        required: true
    },
    otpCode: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 },
    },
    isUsed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// hash otp
otpSchema.pre("save", async function (next) {
    if (!this.isModified('otpCode')) next()
    sendSms(`Your redhope One-time verification code is - ${this.otpCode}. Use the code within 10 minutes. Do not share the otp to others`)
    this.otpCode = await bcrypt.hash(this.otpCode, 10);
    next();
})

// check Otp
otpSchema.methods.checkOtp = async function (otp) {
    return await bcrypt.compare(this.otpCode, otp);
}

export const Otp = mongoose.model('Otp', otpSchema);