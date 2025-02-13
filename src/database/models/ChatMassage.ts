import mongoose, { model, Schema } from "mongoose";
const fields = {
    chatId: {
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
        required: true,
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
            default: null,
        },
        images: [
            {
                publicId: {
                    type: String,
                    required: true,
                    default: "",
                },
                secureURL: {
                    type: String,
                    default: "",
                    required: true,
                },
            },
        ],
        appointmentId: {
            type: mongoose.Schema.ObjectId,
            ref: "ClientAppointment",
            default: null,
        },
    },
};
export const getReceiverId = (senderId: string, ids: string[]) =>
    ids.find((x) => x.toString() !== senderId) ?? "";

export default model("ChatMessage", new Schema(fields, { timestamps: true }));
