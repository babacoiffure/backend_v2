import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./error";

export const handleAsyncHttp =
    (
        func: (
            req: Request,
            albiResponse: AlbiResponse,
            res: Response,
            next: NextFunction
        ) => void
    ) =>
    (req: Request, res: Response, next: NextFunction) => {
        const success = async (
            message: string,
            result: any = null,
            status: number = 200
        ) => {
            const response = {
                success: true,
                message,
                result,
                error: null,
            };

            return res.status(status).json(response);
        };
        const error = async (message: string, status: number = 400) => {
            throw new ErrorHandler(message, status);
        };
        const response = {
            success,
            error,
            default: res,
        };
        // Pushed custom response function
        return Promise.resolve(func(req, response, res, next)).catch(next);
    };

// Types
export type AlbiResponse = {
    success: THttpSuccessFn;
    error: THttpErrorFn;
    default: Response;
};
export type THttpSuccessFn = (
    message: string,
    result?: any,
    status?: number
) => void;
export type THttpErrorFn = (message: string, status?: number) => void;
//
