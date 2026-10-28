const express = require('express');

const userController = require('../controllers/user.controller');

const { authenticate, authorize } = require('../middlewares/auth.middleware');

const ROLES = require('../constants/roles');


const router = express.Router();


router.use(authenticate, authorize(ROLES.ADMIN));


router.get('/', userController.listUsers);

router.get('/:id', userController.getUser);

router.patch('/:id/role', userController.updateRole);

router.delete('/:id', userController.deleteUser);


module.exports = router;
