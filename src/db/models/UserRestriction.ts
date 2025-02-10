import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    from: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    actionType: {
        type: String,
        enum: ["BLOCK", "REPORT"],
        required: true,
    },
    report: {
        reason: {
            type: String,
            default: "Not mentioned",
        },
        note: {
            type: String,
            default: "",
        },
    },
};

// Exporting model
export default model(
    "UserRestriction",
    new Schema(fields, {
        timestamps: true,
    })
);
