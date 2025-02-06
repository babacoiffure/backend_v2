import { NextFunction, Request, Response } from "express";
import { WILD_ROUTE_PATHS, WILD_ROUTES } from "../server.env";
import ErrorHandler from "./errorHandler";
import { verifyAccessToken } from "../lib/jwt.utils";

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const route = req.path;
    // check if route is in wild routes
    if (
        WILD_ROUTES.includes(route) ||
        WILD_ROUTE_PATHS.some((x) => route.includes(x))
    ) {
        return next();
    } else {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return next(new ErrorHandler("Unauthorized access", 401));
        }
        const { valid, decoded }: { valid: boolean; decoded: any } =
            verifyAccessToken(accessToken);

        if (!valid) {
            return next(new ErrorHandler("Invalid token", 403));
        }
        // req.headers.userId = decoded.userId;
        // req.headers.deviceId = decoded.deviceId;
        next();
    }
};
