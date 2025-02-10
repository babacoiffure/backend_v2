import env from "dotenv";
import * as nodemailer from "nodemailer";
env.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_GMAIL_ID,
        pass: process.env.NODEMAILER_GMAIL_APP_PASSWORD,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
    },
});
export const sendEmail = async ({ to, subject, html, text }: any) => {
    try {
        const info = await transporter.sendMail({
            from: "your verified sender email id here", // Replace with your desired sender email
            to,
            subject,
            text,
            html,
        });
        console.log("Email sent successfully!", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};
