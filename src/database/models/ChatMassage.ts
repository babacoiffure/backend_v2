import mongoose, { model, Schema } from "mongoose";
const fields = {
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
    },
    senderId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    type: {
        type: String,
        enums: ["Text", "Image", "Appointment"],
    },
    content: {
        text: {
            type: String,
            default: "",
        },
        image: {
            publicId: {
                type: String,
                required: true,
                default: "",
            },
            secureURL: {
                type: String,
                required: true,
                default: "",
            },
        },
        appointment: {
            type: mongoose.Schema.ObjectId,
            default: "",
        },
    },
};
export default model("ChatMessage", new Schema(fields, { timestamps: true }));
