import {
    ValidationError,
    UniqueConstraintError,
    DatabaseError,
} from "sequelize";
class ErrorHandler extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
}
const asyncErrorHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

//TODO: Add logging functionality with the error handler
const errorHandler = (err, req, res, next) => {
    let code = 500; // default to Internal Server Error
    let message = "Internal Server Error";
    console.log(err);

    // Handle Sequelize validation errors
    if (err instanceof ValidationError) {
        const errors = err.errors.map((error) => error.message);
        message = `Invalid input data. ${errors.join(". ")}`;
        code = 400; // Bad Request
    }
    // Handle Sequelize unique constraint errors
    else if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map((error) => error.message);
        message = `Duplicate field value: ${errors.join(". ")}`;
        code = 400; // Bad Request
    }
    // Handle Sequelize database errors (e.g., type errors, query syntax errors)
    else if (err instanceof DatabaseError) {
        message = `Database error: ${err.message}`;
        code = 500; // Internal Server Error
    }
    // Custom error handler
    else if (err instanceof ErrorHandler) {
        message = err.message;
        code = err.code;
    }

    // Send response with error code and message
    return res.status(code).json({ ok: false, message, data: null });
};

export default ErrorHandler;
export { errorHandler, asyncErrorHandler };
