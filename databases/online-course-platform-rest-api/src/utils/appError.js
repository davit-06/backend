class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        this.status = statusCode >= 500 ? 'error' : 'fail';

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static from({ message, statusCode }) {
        return new AppError(message, statusCode);
    }
}

module.exports = AppError;
