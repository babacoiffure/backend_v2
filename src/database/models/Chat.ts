import mongoose, { model, Schema } from "mongoose";
const fields = {
    userIds: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
        },
    ],
};
export default model("Chat", new Schema(fields, { timestamps: true }));
