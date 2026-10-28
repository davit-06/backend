const USR_ERRORS = {
    NOT_FOUND: { statusCode: 404, message: 'User not found' },

    EMAIL_EXISTS: { statusCode: 409, message: 'A user with this email already exists' },

    INVALID_ROLE: { statusCode: 400, message: 'Role must be one of: admin, instructor, student' },

    CANNOT_DELETE_SELF: { statusCode: 400, message: 'You cannot delete your own account' },

    CANNOT_CHANGE_OWN_ROLE: { statusCode: 400, message: 'You cannot change your own role' }
};

module.exports = USR_ERRORS;