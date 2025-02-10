import mongoose, { model, Schema } from "mongoose";

// Insert table fields here
const fields = {
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    timeTaken: {
        hour: {
            type: Number,
            default: 0,
        },
        minute: {
            type: Number,
            default: 0,
        },
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    attachments: {
        headerImage: {
            publicId: {
                type: String,
                default: "",
            },
            secureURL: {
                type: String,
                default: "",
            },
        },
        galleryImages: [
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
    },
    requiredItems: [
        {
            type: String,
            required: true,
        },
    ],
    addons: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    sizeBasedAddons: [
        {
            name: {
                type: String,
                required: true,
            },
            sizes: [
                {
                    size: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    ],
};

// Exporting model
export default model(
    "ProviderService",
    new Schema(fields, {
        timestamps: true,
    })
);
