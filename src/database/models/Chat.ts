import mongoose, { model, Schema } from "mongoose";
const fields = {
    userIds: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
    ],
};
export default model("Chat", new Schema(fields, { timestamps: true }));
