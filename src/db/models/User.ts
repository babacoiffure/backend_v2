import { model, Schema } from "mongoose";
const modelName = "User";

// Insert table fields here
const fields = {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        default: null,
        select: false,
    },
    userType: {
        type: String,
        required: true,
        enum: ["CLIENT", "PROVIDER"],
    },
    OTP: {
        type: String,
        default: "",
        select: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: "",
    },
};

// Exporting model
export default model(
    modelName,
    new Schema(fields, {
        timestamps: true,
    })
);
