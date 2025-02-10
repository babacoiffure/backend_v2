import { Router } from "express";
import multer from "multer";
import path from "path";
import { handleCreateProviderService } from "../../controllers/provider-service.controller";

export const providerServiceRouter = Router();

// Set up storage engine with multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, "..", "..", "..", "uploads")); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append the original extension
    },
});

// Initialize upload variable with multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Allowed file extensions
        const filetypes = /jpeg|jpg|png|gif|pdf/;
        const extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(
                new Error(
                    "Error: File upload only supports the following filetypes - " +
                        filetypes
                )
            );
        }
    },
});

providerServiceRouter.post(
    "/create",
    upload.fields([
        { name: "galleryImages", maxCount: 5 },
        { name: "headerImage", maxCount: 1 },
    ]),
    handleCreateProviderService
);
