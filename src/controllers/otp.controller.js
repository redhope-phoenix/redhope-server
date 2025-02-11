import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
const createOtp = async (phoneNo) => {
    const otpCode = generateOtp();
    const preOtp = await Otp.findOne({ phoneNo });
    if (preOtp) Otp.deleteOne({ phoneNo });
    try {
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const otp = await Otp.create({
            phoneNo,
            otpCode,
            expiresAt
        })

        return otp;
    } catch (error) {
        throw new ApiError(501, "Unable to generate otp")
    }

}

const createOtpRequest = asyncHandler(async (req, res) => {
    const { phoneNo } = req.body;

    const otp = await createOtp(phoneNo);

    
})

export { createOtp }