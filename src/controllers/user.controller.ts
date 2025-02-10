import fs from "fs";
import User, { generateUniqueUID } from "../database/models/User";
import { uploadImage } from "../libraries/cloudinary";
import { handleAsyncHttp } from "../middleware/controller";
import queryHelper from "../utils/query-helper";

export const handleUpdateUserInfo = handleAsyncHttp(async (req, res) => {
    let updatedInfo = {
        ...req.body,
    };
    if (req.body.name) {
        updatedInfo.uid = await generateUniqueUID(req.body.name);
    }
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

export const handleGetUserList = handleAsyncHttp(async (req, res) => {
    const list = await queryHelper(User, req.query);
    res.success("User list", list);
});
