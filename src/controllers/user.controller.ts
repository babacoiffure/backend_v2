import User from "../db/models/User";
import { uploadImage } from "../lib/cloudinary";
import { handleAsyncHttp } from "../middleware/handleController";
import fs from "fs";

export const handleUpdateUserInfo = handleAsyncHttp(async (req, res) => {
    let updatedInfo = {
        ...req.body,
    };
    if (req.file) {
        const imagePath = req.file.path;
        const { secure_url } = await uploadImage(imagePath);
        fs.unlink(imagePath, (err) => {
            console.log(err);
        });
        updatedInfo.avatar = secure_url;
    }

    const user = await User.findByIdAndUpdate(req.params.userId, updatedInfo, {
        new: true,
        runValidators: true,
    });

    res.success("Updated user info", user, 200);
});
