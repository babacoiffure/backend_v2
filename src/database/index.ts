import mongoose from "mongoose";
import { serverENV } from "../env-config";
import { seedDatabase } from "./seeder";

export const connectDB = async () => {
    try {
        await mongoose.connect(serverENV.Database_URI, {
            retryWrites: true,
        });
        console.log("⚡ DB Connected");
        await seedDatabase();
    } catch (err) {
        console.log(" 🔥 DB Connection error:", err);
    }
};
