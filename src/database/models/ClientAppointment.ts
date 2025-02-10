import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    providerId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    clientId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    timeTaken: {
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
    },
    status: {
        type: String,
        enums: ["Accepted", "Pending"],
    },
};

// Exporting model
export default model(
    "ClientAppointment",
    new Schema(fields, {
        timestamps: true,
    })
);
