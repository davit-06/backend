const { User, Course } = require('../models');

const appError = require('../utils/appError');

const ROLES = require('../constants/roles');

const USER_ERRORS = require('../constants/errors/user.errors');


const isValidRole = (role) => Object.values(ROLES).includes(role);


const findUserOrThrow = async (id) => {
    const user = await User.findByPk(id);

    if (!user) { throw appError.from(USER_ERRORS.NOT_FOUND); }

    return user;
};


const listUsers = async (query) => {
    const where = {};

    if (query.role) {
        if (!isValidRole(query.role)) { throw appError.from(USER_ERRORS.INVALID_ROLE); }

        where.role = query.role;
    }

    return User.findAll({
        where,

        order: [['id', 'ASC']]
    });
};


const getUserById = async (id) => {
    const user = await findUserOrThrow(id);

    const include = [];

    if (user.role === ROLES.INSTRUCTOR) {
        include.push({ model: Course, as: 'courses' });
    }

    if (user.role === ROLES.STUDENT) {
        include.push({
            model: Course,

            as: 'enrolledCourses',

            through: { attributes: ['status', 'progress', 'enrolledAt'] }
        });
    }

    return User.findByPk(id, { include });
};


const updateUserRole = async (actor, id, role) => {
    if (!isValidRole(role)) { throw appError.from(USER_ERRORS.INVALID_ROLE); }

    if (actor.id === id) { throw appError.from(USER_ERRORS.CANNOT_CHANGE_OWN_ROLE); }

    const user = await findUserOrThrow(id);

    user.role = role;

    await user.save();

    return user;
};


const deleteUser = async (actor, id) => {
    if (actor.id === id) { throw appError.from(USER_ERRORS.CANNOT_DELETE_SELF); }

    const user = await findUserOrThrow(id);

    await user.destroy();
};


module.exports = { listUsers, getUserById, updateUserRole, deleteUser };
