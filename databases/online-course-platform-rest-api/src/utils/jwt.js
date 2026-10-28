const jwt = require('jsonwebtoken');

const { jwt_secret, jwt_expires_in } = require('../config/env');


const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role },

        jwt_secret,

        { expiresIn: jwt_expires_in }
    );
};


const verifyToken = (token) => {
    return jwt.verify(token, jwt_secret);
};


module.exports = { generateToken, verifyToken };
