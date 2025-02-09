import jwt from "jsonwebtoken";
import { handleAsyncHttp } from "../middleware/handleController";
import User from "../db/models/User";
import * as bcrypt from "bcrypt";

import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../lib/jwt.utils";
import { serverENV } from "../env";
import ErrorHandler from "../middleware/errorHandler";
import { configDotenv } from "dotenv";
import { sendEmail } from "../lib/mailer";
import { generateOTP } from "../lib/utils";

configDotenv();

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
    res.success("User signup successful", await User.findById(user._id), 200);
});

export const handleCredentialSignIn = handleAsyncHttp(async (req, res) => {
    const { email, password, userType } = req.body;
    const user = await User.findOne({ email, userType }).select("+password");
    if (!user) {
        throw new Error("User doesn't exists");
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log(isValid);
    if (!isValid) {
        throw new Error("email/password incorrect");
    }
    // if (!() {
    // }

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
            accessToken: _accessToken,
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
    const { email, userType } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email, userType });
    if (!user) {
        throw new ErrorHandler("User  with this email does not exist.", 400);
    }

    const OTP = generateOTP(5);

    const mailOptions = {
        to: email,
        subject: "Password Reset OTP",
        // text: `Click the link to reset your password: http://localhost:${serverENV.PORT}/api/v1/reset-password/${token}.\nThis token is valid for next 1 hour.`,
        html: `<div>
        <p>Your <b>SALOON App</b> password resetting OTP is</p>
        <br>
        <h1>${OTP}</h1>
        </div>`,
    };
    await sendEmail(mailOptions);
    user.OTP = OTP;
    await user.save();
    res.success("Password resetting OTP sent in your mail.", null, 200);
});

export const handleVerifyOTP = handleAsyncHttp(async (req, res) => {
    const { OTP, userType, email } = req.body;
    const user = await User.findOne({ email, userType }).select("+OTP");
    if (!user) {
        throw new ErrorHandler("No user found!", 400);
    }
    if (user.OTP !== OTP) {
        throw new ErrorHandler("Wrong OTP", 400);
    }
    user.OTP = "";
    await user.save();
    res.success(
        "OTP verified!",
        {
            token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET!, {
                expiresIn: "1h",
            }),
        },
        200
    );
});
export const handleResetPassword = handleAsyncHttp(async (req, res) => {
    const { token, password } = req.body;
    const decode: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    if (!decode.userId) {
        throw new Error("Invalid token, userId not found.");
    }
    const user = await User.findById(decode.userId).select("+password");
    if (!user) {
        throw new Error("User not found.");
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.success("Password reset successful", null, 200);
});
