import { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    title: {
        type: String,
        required: true,
    },
    renewalPeriod: {
        type: String,
        enums: ["Monthly", "Yearly", "Weekly"],
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
};

// Exporting model
export default model(
    "Subscription",
    new Schema(fields, {
        timestamps: true,
    })
);
