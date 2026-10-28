const { sequelize, User, Course, Lesson } = require('../models');

const appError = require('../utils/appError');

const { canAccessLessons } = require('./lesson.service');

const ROLES = require('../constants/roles');

const COURSE_ERRORS = require('../constants/errors/course.errors');


const COURSE_FIELDS = ['title', 'description', 'category', 'level', 'price', 'isPublished'];

const INSTRUCTOR_ATTRIBUTES = ['id', 'fullName', 'email'];


const lessonsCount = [
    sequelize.literal('(SELECT CAST(COUNT(*) AS INTEGER) FROM "lessons" AS "l" WHERE "l"."courseId" = "Course"."id")'),

    'lessonsCount'
];


const instructorInclude = { model: User, as: 'instructor', attributes: INSTRUCTOR_ATTRIBUTES };


const pickCourseFields = (body) => {
    const data = {};

    COURSE_FIELDS.forEach((field) => {
        if (body[field] !== undefined) { data[field] = body[field]; }
    });

    return data;
};


const isOwnerOrAdmin = (course, user) => {
    return Boolean(user) && (user.role === ROLES.ADMIN || course.instructorId === user.id);
};


const assertPrice = (price) => {
    if (price !== undefined && !(Number(price) >= 0)) {
        throw appError.from(COURSE_ERRORS.INVALID_PRICE);
    }
};


const assertTitle = (title) => {
    if (title !== undefined && !String(title).trim()) {
        throw appError.from(COURSE_ERRORS.TITLE_REQUIRED);
    }
};


const findCourseOrThrow = async (id) => {
    const course = await Course.findByPk(id);

    if (!course) { throw appError.from(COURSE_ERRORS.NOT_FOUND); }

    return course;
};


const buildListFilters = (query) => {
    const where = {};

    if (query.category) { where.category = query.category; }

    if (query.level) {
        if (!Course.LEVELS.includes(query.level)) { throw appError.from(COURSE_ERRORS.INVALID_LEVEL); }

        where.level = query.level;
    }

    return where;
};


const findCoursesPage = async (where) => {
    return Course.findAll({
        where,

        attributes: { include: [lessonsCount] },

        include: [instructorInclude],

        order: [['createdAt', 'DESC'], ['id', 'DESC']]
    });
};


const listPublishedCourses = async (query) => {
    const where = { ...buildListFilters(query), isPublished: true };

    return findCoursesPage(where);
};


const listMyCourses = async (user, query) => {
    const where = { ...buildListFilters(query), instructorId: user.id };

    return findCoursesPage(where);
};


const getCourseById = async (id, user) => {
    const course = await Course.findByPk(id, {
        attributes: { include: [lessonsCount] },

        include: [instructorInclude]
    });

    if (!course) { throw appError.from(COURSE_ERRORS.NOT_FOUND); }

    if (!course.isPublished && !isOwnerOrAdmin(course, user)) {
        throw appError.from(COURSE_ERRORS.NOT_FOUND);
    }

    const fullAccess = await canAccessLessons(course, user);

    const lessons = await Lesson.findAll({
        where: { courseId: id },

        attributes: fullAccess ? undefined : ['id', 'title', 'duration', 'order'],

        order: [['order', 'ASC']]
    });

    return { ...course.toJSON(), lessons };
};


const createCourse = async (user, body) => {
    const data = pickCourseFields(body);

    assertTitle(data.title);

    assertPrice(data.price);

    return Course.create({ ...data, instructorId: user.id });
};


const updateCourse = async (id, user, body) => {
    const course = await findCourseOrThrow(id);

    if (!isOwnerOrAdmin(course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER); }

    const data = pickCourseFields(body);

    assertTitle(data.title);

    assertPrice(data.price);

    await course.update(data);

    return course;
};


const deleteCourse = async (id, user) => {
    const course = await findCourseOrThrow(id);

    if (!isOwnerOrAdmin(course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER); }

    await course.destroy();
};


const listCourseStudents = async (id, user, query) => {
    const course = await findCourseOrThrow(id);

    if (!isOwnerOrAdmin(course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER_VIEW); }

    const rows = await User.findAll({
        include: [{
            model: Course,

            as: 'enrolledCourses',

            attributes: ['id'],

            where: { id },

            through: { attributes: ['status', 'progress', 'enrolledAt'] }
        }],

        order: [['id', 'ASC']]
    });

    const students = rows.map((row) => {
        const { enrolledCourses, ...student } = row.toJSON();

        return { ...student, enrollment: enrolledCourses[0].Enrollment };
    });

    return students;
};


module.exports = {
    listPublishedCourses,

    listMyCourses,

    getCourseById,

    createCourse,

    updateCourse,

    deleteCourse,

    listCourseStudents
};
