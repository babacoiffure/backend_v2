import mongoose from "mongoose";
import { serverENV } from "../env-config";

export const connectDB = async () => {
    try {
        await mongoose.connect(serverENV.Database_URI, {
            retryWrites: true,
        });
        console.log("⚡ DB Connected");
    } catch (err) {
        console.log(" 🔥 DB Connection error:", err);
    }
};
