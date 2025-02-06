import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./errorHandler";
import { serverENV } from "../env.server";

export const errorMiddleware = (
    _err: Error | any,
    _req: Request,
    _res: Response,
    _next: NextFunction
) => {
    let error = _err;
    if (!error.message) {
        error.message = error.message || "Internal Server Error";
    }
    if (!error?.statusCode) {
        error.statusCode = error.statusCode || 500;
    }

    // Handling mongoose CastError
    if (error.name === "CastError") {
        error = new ErrorHandler(
            `Resource not found. Invalid:${error.path}`,
            400
        );
    }

    // Handling mongoose validation error
    if (error.name === "ValidationError") {
        error = new ErrorHandler(
            Object.values(error.errors)
                .map((value: any) => value.message)
                .join(", "),
            400
        );
    }

    // Wrong Mongodb Id error
    if (error.name === "CastError") {
        error = new ErrorHandler(
            `Resource not found. Invalid: ${error.path}`,
            400
        );
    }

    // Mongoose duplicate key error
    if (error.code === 11000) {
        error = new ErrorHandler(
            `Duplicate ${Object.keys(error.keyValue)} Entered`,
            400
        );
    }

    // Wrong JWT error
    if (error.name === "JsonWebTokenError") {
        new ErrorHandler(`Json Web Token is invalid, Try again `, 400);
    }

    // JWT EXPIRE error
    if (error.name === "TokenExpiredError") {
        new ErrorHandler(`Json Web Token is Expired, Try again `, 400);
    }

    console.log(error);
    _res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error,
        data: null,
        stack: serverENV.NODE_ENV === "development" ? error.stack : null,
    });
};
