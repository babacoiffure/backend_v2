import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { generateUniqueUID } from "../database/models/User";
import { handleAsyncHttp } from "../middleware/controller";

import { configDotenv } from "dotenv";
import { serverConfigs, serverENV } from "../env-config";
import { sendEmail } from "../libraries/mailer";
import { ErrorHandler } from "../middleware/error";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/jwt";
import { generateOTP } from "../utils/utils";

configDotenv();

export const handleCredentialSignUp = handleAsyncHttp(async (req, res) => {
    const { name, email, userType, password } = req.body;
    const isExists = await User.findOne({ email, userType });
    if (isExists) {
        throw new ErrorHandler("User Already exists", 409);
    }

    const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        userType,
        uid: await generateUniqueUID(name),
    });
    const OTP = generateOTP(5);

    const mailOptions = {
        to: email,
        subject: "Email verification OTP",
        html: `<div>
        <p>Your <b>${serverConfigs.app.name}</b> password resetting OTP is</p>
        <br>
        <h1>${OTP}</h1>
        </div>`,
    };
    await sendEmail(mailOptions);
    user.OTP = OTP;
    await user.save();
    res.success(
        "User signup successful!\nWe send a mail with OTP to verify your mail.Please verify your mail before logging in.",
        await User.findById(user._id),
        200
    );
});

export const handleCredentialSignIn = handleAsyncHttp(async (req, res) => {
    const { email, password, userType } = req.body;
    const user = await User.findOne({ email, userType }).select([
        "+password",
        "+otp",
    ]);
    if (!user) {
        return res.error("User doesn't exists", 400);
    }

    if (!user.emailVerified) {
        return res.error("Please verify your mail first!", 400);
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.error("email/password incorrect", 400);
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
    res.success("Login successful", await User.findById(user._id), 200);
});

export const handleVerifyEmailWithOTP = handleAsyncHttp(async (req, res) => {
    const { OTP, email, userType } = req.body;
    const user = await User.findOne({
        email,
        userType,
    });

    if (!user) {
        return res.error("User not identified by this email and userType", 404);
    }
    if (!user.OTP == OTP) {
        return res.error("Wrong OTP", 400);
    }
    user.emailVerified = true;
    await user.save();
    res.success(
        "OTP matched for email verification. Your email now verified.",
        null,
        200
    );
});

export const handleRefreshToken = handleAsyncHttp(async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new ErrorHandler("Forbidden: no refresh token", 401);
    }
    const { valid, decoded } = verifyRefreshToken(refreshToken);
    if (!valid || !decoded?.userType || !decoded.userId) {
        throw new ErrorHandler("Invalid refresh token", 401);
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

// Handle Password reset
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
        <p>Your <b>${serverConfigs.app.name}</b> password resetting OTP is</p>
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
