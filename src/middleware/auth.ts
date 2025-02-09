import { NextFunction, Request, Response } from "express";
import { serverConfigs } from "../env";
import { verifyAccessToken } from "../lib/jwt";
import { ErrorHandler } from "./error";

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // check for wild routes
    if (serverConfigs.wildRoutes.includes(req.path)) return next();

    // check for accessToken
    let accessToken = req.cookies["accessToken"];

    if (!accessToken) {
        return next(new ErrorHandler("Access token is empty", 401));
    }
    const { valid, decoded }: { valid: boolean; decoded: any } =
        verifyAccessToken(accessToken);

    if (!valid) {
        return next(new ErrorHandler("Invalid token", 403));
    }
    req.headers.userId = decoded.userId;
    req.headers.userType = decoded.userType;
    next();
};
