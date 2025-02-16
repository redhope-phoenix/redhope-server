import nodemailer from "nodemailer"
import { ApiError } from "./api-error.js";

export const sendNodeEmail = async ({ mailTo, subject, html }) => {
    const mailFrom = "redhope.phoenix@gmail.com"

    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    });

    // Email options
    const mailOptions = {
        from: `Hostel Betting <${mailFrom}>`,
        to: mailTo,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new ApiError(400, 'Could not send email');
    }

}