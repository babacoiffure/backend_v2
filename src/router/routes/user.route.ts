import { Router } from "express";
import multer from "multer";
import path from "path";
import {
    handleGetUserList,
    handleHandleGetUserById,
    handleUpdateUserInfo,
} from "../../controllers/user.controller";
export const userRouter = Router();

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

userRouter.post(
    "/update-profile/:userId",
    upload.single("avatar"),
    handleUpdateUserInfo
);

userRouter.get("/list", handleGetUserList);
userRouter.get("/by-id/:id", handleHandleGetUserById);
