const { verifyToken } = require('../utils/jwt');

const appError = require('../utils/appError');

const asyncHandler = require('../utils/asyncHandler');

const { User } = require('../models');

const AUTH_ERRORS = require('../constants/errors/auth.errors');


const extractToken = (req) => {
    const header = req.headers.authorization;

    if (!header) { return null; }

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) { return null; }

    return token;
};


const resolveUser = async (token) => {
    const payload = verifyToken(token);

    const user = await User.findByPk(payload.id);

    if (!user) { throw appError.from(AUTH_ERRORS.TOKEN_INVALID); }

    return user;
};


const authenticate = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (!token) { throw appError.from(AUTH_ERRORS.TOKEN_MISSING); }

    req.user = await resolveUser(token);

    next();
});


const optionalAuthenticate = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);

    if (token) { req.user = await resolveUser(token); }

    next();
});


const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        throw appError.from(AUTH_ERRORS.FORBIDDEN);
    }

    next();
};


module.exports = { authenticate, optionalAuthenticate, authorize };
