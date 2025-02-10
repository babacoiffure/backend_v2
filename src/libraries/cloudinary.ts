import { v2 as cloudinary } from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs";
import { serverConfigs } from "../env-config";

configDotenv();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export const destroyImage = async (publicId: string) =>
    cloudinary.uploader.destroy(publicId);

export const uploadImage = async (imagePath: string, folderName = "Photos") => {
    let data = await cloudinary.uploader.upload(imagePath, {
        folder: `${folderName}-${serverConfigs.app.name}`,
    });
    await removeFile(imagePath);
    return data;
};

export const removeFile = async (filePath: string) =>
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            console.log("File doesn't exists.");
            return;
        }

        // File exists, proceed to delete it
        fs.unlink(filePath, (err) => {
            if (err) {
                // Handle error during file deletion
                console.log("Problem on deleting", err);
                return;
            }
            // File deleted successfully
            console.log("Successfully Deleted.");
        });
    });
