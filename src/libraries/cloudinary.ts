import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { serverConfigs, serverENV } from "../env-config";

cloudinary.config({
    cloud_name: serverENV.CLOUDINARY_CLOUD_NAME,
    api_key: serverENV.CLOUDINARY_API_KEY,
    api_secret: serverENV.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

export const destroyImage = async (publicId: string) =>
    cloudinary.uploader.destroy(publicId);

export const uploadImage = async (imagePath: string, folderName = "Photos") => {
    let data = await cloudinary.uploader.upload(imagePath, {
        folder: `${folderName}-${serverConfigs.app.name}`,
    });
    removeFile(imagePath);
    return data;
};

export const removeFile = (filePath: string) =>
    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File does not exist
            console.log("File doesn't exists with path " + filePath);
        } else {
            // File exists, proceed to delete it
            fs.unlinkSync(filePath);
        }
    });
