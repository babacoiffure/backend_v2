import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    userId: {
        type: String,
        required: true,
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    issuedAt: {
        type: Date,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
    stripeData: {
        type: Object,
        required: true,
    },
};

// Exporting model
export default model(
    "SubscriptionOwner",
    new Schema(fields, {
        timestamps: true,
    })
);
