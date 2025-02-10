import { Router } from "express";
import {
    handleCredentialSignIn,
    handleCredentialSignUp,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyEmailWithOTP,
    handleVerifyOTP,
} from "../../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/credential/sign-up", handleCredentialSignUp);
authRouter.post("/verify-email-with-otp", handleVerifyEmailWithOTP);
authRouter.post("/credential/sign-in", handleCredentialSignIn);
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/verify-identity-with-otp", handleVerifyOTP);
authRouter.post("/reset-password", handleResetPassword);
