const authService = require('../services/auth.service');

const asyncHandler = require('../utils/asyncHandler');


const register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    res.status(201).json({ success: true, data: user });
});


const login = asyncHandler(async (req, res) => {
    const { token, user } = await authService.login(req.body);

    res.status(200).json({ success: true, data: { token, user } });
});


const me = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: req.user });
});


module.exports = { register, login, me };