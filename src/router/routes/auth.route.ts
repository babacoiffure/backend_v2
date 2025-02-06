import { Router } from "express";
import {
    handleCredentialSignIn,
    handleCredentialSignUp,
    handleForgotPassword,
    handleResetPassword,
    handleVerifyOTP,
} from "../../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/credential/sign-up", handleCredentialSignUp);
authRouter.post("/credential/sign-in", handleCredentialSignIn);
authRouter.post("/forgot-password", handleForgotPassword);
authRouter.post("/verify-otp", handleVerifyOTP);
authRouter.post("/reset-password", handleResetPassword);
