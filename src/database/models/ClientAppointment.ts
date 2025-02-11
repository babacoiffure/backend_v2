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
    scheduleDate: {
        type: Date,
        required: true,
    },
    timePeriod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enums: ["Accepted", "Pending"],
        default: "Pending",
    },
    rescheduleProposals: [
        {
            from: {
                type: String,
                enums: ["Client", "Provider"],
            },
            scheduleDate: {
                type: Date,
                required: true,
            },
            timePeriod: {
                type: String,
                required: true,
            },
        },
    ],
};

// Exporting model
export default model(
    "ClientAppointment",
    new Schema(fields, {
        timestamps: true,
    })
);
