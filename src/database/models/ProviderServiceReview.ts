import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    serviceId: {
        type: mongoose.Schema.ObjectId,
        ref: "ProviderService",
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    attachments: [
        {
            publicId: {
                type: String,
                default: "",
            },
            secureURL: {
                type: String,
                default: "",
            },
        },
    ],
};

// Exporting model
export default model(
    "ServiceReview",
    new Schema(fields, {
        timestamps: true,
    })
);
