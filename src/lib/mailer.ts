import * as nodemailer from "nodemailer";
import env from "dotenv";
env.config();
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.GMAIL_PASS,
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
