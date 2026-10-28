const bcrypt = require('bcrypt');

const { User } = require('../models');

const appError = require('../utils/appError');

const { generateToken } = require('../utils/jwt');

const ROLES = require('../constants/roles');

const AUTH_ERRORS = require('../constants/errors/auth.errors');

const USER_ERRORS = require('../constants/errors/user.errors');


const SALT_ROUNDS = 10;


const register = async ({ fullName, email, password }) => {
    const existing = await User.findOne({ where: { email } });

    if (existing) { throw appError.from(USER_ERRORS.EMAIL_EXISTS); }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
        fullName,

        email,

        password: hashedPassword,

        role: ROLES.STUDENT
    });

    return user;
};


const login = async ({ email, password }) => {
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) { throw appError.from(AUTH_ERRORS.INVALID_CREDENTIALS); }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) { throw appError.from(AUTH_ERRORS.INVALID_CREDENTIALS); }

    const token = generateToken(user);

    return { token, user };
};


module.exports = { register, login };
