const COURSE_ERRORS = {
    NOT_FOUND: { statusCode: 404, message: 'Course not found' },

    NOT_OWNER: { statusCode: 403, message: 'You can only modify your own courses' },

    NOT_OWNER_VIEW: { statusCode: 403, message: 'You can only view students of your own courses' },

    NOT_PUBLISHED: { statusCode: 400, message: 'Course is not published yet' },

    TITLE_REQUIRED: { statusCode: 400, message: 'Course title is required' },

    INVALID_PRICE: { statusCode: 400, message: 'Price must be 0 or greater' },

    INVALID_LEVEL: { statusCode: 400, message: 'Level must be one of: beginner, intermediate, advanced' }
};

module.exports = COURSE_ERRORS;