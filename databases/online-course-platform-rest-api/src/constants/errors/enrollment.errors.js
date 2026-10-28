const ENROLLMENT_ERRORS = {
    NOT_FOUND: { statusCode: 404, message: 'Enrollment not found' },

    ALREADY_ENROLLED: { statusCode: 409, message: 'You are already enrolled in this course' },

    OWN_COURSE: { statusCode: 400, message: 'You cannot enroll in your own course' },

    INVALID_PROGRESS: { statusCode: 400, message: 'Progress must be an integer between 0 and 100' },

    NOT_OWNER: { statusCode: 403, message: 'You can only manage your own enrollments' },

    CANCELLED: { statusCode: 400, message: 'A cancelled enrollment cannot be updated' },

    ALREADY_CANCELLED: { statusCode: 400, message: 'Enrollment is already cancelled' }
};

module.exports = ENROLLMENT_ERRORS;
