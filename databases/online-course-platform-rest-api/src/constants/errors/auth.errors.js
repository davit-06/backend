const AUTH_ERRORS = {
    INVALID_CREDENTIALS: { statusCode: 401, message: 'Invalid email or password' },

    TOKEN_MISSING: { statusCode: 401, message: 'Authentication token is missing' },

    TOKEN_INVALID: { statusCode: 401, message: 'Authentication token is invalid' },

    TOKEN_EXPIRED: { statusCode: 401, message: 'Authentication token has expired' },

    FORBIDDEN: { statusCode: 403, message: 'You do not have permission to perform this action' }
};

module.exports = AUTH_ERRORS;