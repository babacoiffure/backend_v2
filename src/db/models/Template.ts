import { model, Schema } from "mongoose";

// Insert table fields here
const fields = {};

// Exporting model
export default model(
    "ModelName",
    new Schema(fields, {
        timestamps: true,
    })
);
