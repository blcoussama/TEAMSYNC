import { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/Http.CONFIG";
import { AppError } from "../utils/AppError.UTIL";

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {

    console.error(`Error Occurred on path : ${req.path}`, error);

    if(error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload. Please check the request payload."
        })
    }

    if(error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode
        })
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown Error Occured"
    })
}

