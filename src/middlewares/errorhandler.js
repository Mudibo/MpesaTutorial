import { ZodError } from "zod";
import AppError from "../errors/AppError.js";

export function errorHandler(error, req, res, next) {
    // Zod validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            })),
        });
    }
    // Custom application errors
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    // Unexpected errors
    console.error(error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}