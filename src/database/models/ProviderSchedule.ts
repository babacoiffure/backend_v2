import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    workingDays: [
        {
            type: String,
            enums: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
        },
    ],
    availableAt: [
        {
            type: String,
            enum: ["Provider", "Client", "No Matter"],
        },
    ],
    selectedTimes: [
        {
            startAt: {
                type: Date,
                required: true,
            },
            endAt: {
                type: Date,
                required: true,
            },
        },
    ],
    isRepeatingTimeEveryday: {
        type: Boolean,
        required: true,
    },
};

// Exporting model
export default model(
    "ProviderSchedule",
    new Schema(fields, {
        timestamps: true,
    })
);
