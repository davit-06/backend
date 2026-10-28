const appError = require('../utils/appError');

const AUTH_ERRORS = require('../constants/errors/auth.errors');


const notFoundHandler = (req, res, next) => {
    next(new appError('Route not found', 404));
};


const normalizeError = (err) => {
    if (err instanceof appError) {
        return { statusCode: err.statusCode, message: err.message };
    }

    if (err.name === 'SequelizeValidationError') {
        return { statusCode: 400, message: err.errors.map((item) => item.message).join(', ') };
    }

    if (err.name === 'SequelizeUniqueConstraintError') {
        const fields = err.errors.map((item) => item.path).join(', ');

        return { statusCode: 409, message: `Duplicate value for: ${fields}` };
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return { statusCode: 400, message: 'Related record does not exist' };
    }

    if (err.name === 'TokenExpiredError') {
        return AUTH_ERRORS.TOKEN_EXPIRED;
    }

    if (err.name === 'JsonWebTokenError') {
        return AUTH_ERRORS.TOKEN_INVALID;
    }

    if (err.type === 'entity.parse.failed') {
        return { statusCode: 400, message: 'Invalid JSON body' };
    }

    return null;
};


const errorHandler = (err, req, res, next) => {
    const normalized = normalizeError(err);

    if (normalized) {
        return res.status(normalized.statusCode).json({
            success: false,

            statusCode: normalized.statusCode,

            message: normalized.message
        });
    }

    console.error(err);

    res.status(500).json({ success: false, statusCode: 500, message: 'Something went wrong' });
};


module.exports = { notFoundHandler, errorHandler };
