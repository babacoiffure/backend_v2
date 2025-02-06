import { handleAsyncHttp } from "../middleware/handleController";
import User from "../db/models/User";
import * as bcrypt from "bcrypt";
import * as cryptro from "crypto";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../lib/jwt.utils";
import { serverENV } from "../env.server";
import ErrorHandler from "../middleware/errorHandler";
export const handleCredentialSignUp = handleAsyncHttp(async (req, res) => {
    const { name, email, userType, password } = req.body;
    const isExists = await User.findOne({ email, userType });
    if (isExists) {
        return res.error(
            "User already exists",
            new Error("User Already exists"),
            409
        );
    }

    const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        userType,
    });
    res.success("User signup successful", user, 200);
});

export const handleCredentialSignIn = handleAsyncHttp(async (req, res) => {
    const { email, password, userType } = req.body;
    const user = await User.findOne({ email, userType }).select("+password");
    if (!user) {
        throw new Error("User doesn't exists");
    }

    if (!(await bcrypt.compare(password, user.password))) {
        throw new Error("email/password incorrect");
    }

    const _accessToken = generateAccessToken({
        userId: user._id.toString(),
        userType: user.userType.toString(),
    });
    const _refreshToken = generateRefreshToken({
        userId: user._id.toString(),
        userType: user.userType.toString(),
    });
    res.default.cookie("accessToken", _accessToken, {
        httpOnly: true,
        secure: serverENV.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.default.cookie("refreshToken", _refreshToken, {
        httpOnly: true,
        secure: serverENV.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.success(
        "Login successful",
        {
            user: await User.findById(user._id),
            accessToke: _accessToken,
            refreshToken: _refreshToken,
        },
        200
    );
});

export const handleRefreshToken = handleAsyncHttp(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.error("Forbidden: no refresh token", 401);
    }
    const { valid, decoded } = verifyRefreshToken(refreshToken);
    if (!valid || !decoded?.userType || !decoded.userId) {
        return res.error("Invalid refresh token", 401);
    }
    const newAccessToken = generateAccessToken({
        userId: decoded?.userId,
        userType: decoded?.userType,
    });
    res.default.cookie("accessToken", newAccessToken, {
        sameSite: "strict",
        secure: serverENV.NODE_ENV === "production",
        httpOnly: true,
    });
    res.success("Token refreshed", { refreshToken });
});

export const handleForgotPassword = handleAsyncHttp(async (req, res) => {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new ErrorHandler("User  with this email does not exist.", 400);
    }

    // Generate a reset token
    const token = crypto.randomUUID;
    await new Token({ userId: user._id, token }).save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset",
        text: `Click the link to reset your password: http://localhost:${PORT}/reset-password/${token}`,
    };
});
