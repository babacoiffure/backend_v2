import mongoose from "mongoose";
import { serverENV } from "../env.server";

export const connectDB = async () => {
    try {
        await mongoose.connect(serverENV.database.uri, {
            retryWrites: true,
        });
        console.log("⚡ DB Connected");
    } catch (err) {
        console.log(" 🔥 DB Connection error:", err);
    }
};
