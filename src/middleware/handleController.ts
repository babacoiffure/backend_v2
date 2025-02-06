import { NextFunction, Request, Response } from "express";

export const handleAsyncHttp =
    (
        func: (
            req: Request,
            customResFn: THttpResponse,
            res: Response,
            next: NextFunction
        ) => void
    ) =>
    (req: Request, res: Response, next: NextFunction) => {
        const success = async (
            message: string,
            result: any,
            status: number = 200
        ) => {
            const response = {
                success: true,
                message,
                result,
                error: null,
            };
            // console.log(
            //     ` \nResponse : ${JSON.stringify(
            //         {
            //             success: true,
            //             message,
            //             result,
            //             error: null,
            //         },
            //         null,
            //         2
            //     )}\n`
            // );
            return res.status(status).json(response);
        };
        const error = async (
            message: string,
            error: any,
            status: number = 400
        ) => {
            res.status(status).json({
                success: false,
                message,
                error,
                result: null,
            });
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
export type THttpResponse = {
    success: THttpSuccessFn;
    error: THttpErrorFn;
    default: Response;
};
export type THttpSuccessFn = (
    message: string,
    result: any,
    status?: number
) => void;
export type THttpErrorFn = (
    message: string,
    error: any,
    status?: number
) => void;
//
