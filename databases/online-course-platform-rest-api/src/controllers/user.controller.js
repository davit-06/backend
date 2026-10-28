const userService = require('../services/user.service');

const asyncHandler = require('../utils/asyncHandler');


const listUsers = asyncHandler(async (req, res) => {
    const users = await userService.listUsers(req.query);

    res.status(200).json({ success: true, data: users });
});


const getUser = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));

    res.status(200).json({ success: true, data: user });
});


const updateRole = asyncHandler(async (req, res) => {
    const user = await userService.updateUserRole(req.user, Number(req.params.id), req.body.role);

    res.status(200).json({ success: true, data: user });
});


const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.user, Number(req.params.id));
    
    res.status(200).json({ success: true, data: { message: 'User deleted successfully' } });
});



module.exports = { listUsers, getUser, updateRole, deleteUser };