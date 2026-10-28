const { Op } = require('sequelize');

const { Lesson, Course, Enrollment } = require('../models');

const appError = require('../utils/appError');

const ROLES = require('../constants/roles');

const COURSE_ERRORS = require('../constants/errors/course.errors');

const LESSON_ERRORS = require('../constants/errors/lesson.errors');


const LESSON_FIELDS = ['title', 'content', 'videoUrl', 'duration', 'order'];


const pickLessonFields = (body) => {
    const data = {};

    LESSON_FIELDS.forEach((field) => {
        if (body[field] !== undefined) { data[field] = body[field]; }
    });

    if (data.videoUrl === '') { data.videoUrl = null; }

    return data;
};


const isOwnerOrAdmin = (course, user) => {
    return user.role === ROLES.ADMIN || course.instructorId === user.id;
};


const canAccessLessons = async (course, user) => {
    if (!user) { return false; }

    if (isOwnerOrAdmin(course, user)) { return true; }

    const enrollment = await Enrollment.findOne({
        where: {
            userId: user.id,

            courseId: course.id,

            status: { [Op.in]: ['active', 'completed'] }
        }
    });

    return Boolean(enrollment);
};


const assertDuration = (duration) => {
    if (duration !== undefined && !(Number(duration) > 0)) {
        throw appError.from(LESSON_ERRORS.INVALID_DURATION);
    }
};


const assertOrderFree = async (courseId, order, ignoreId = null) => {
    const where = { courseId, order };

    if (ignoreId) { where.id = { [Op.ne]: ignoreId }; }

    const existing = await Lesson.findOne({ where });

    if (existing) { throw appError.from(LESSON_ERRORS.ORDER_EXISTS); }
};


const findCourseOrThrow = async (courseId) => {
    const course = await Course.findByPk(courseId);

    if (!course) { throw appError.from(COURSE_ERRORS.NOT_FOUND); }

    return course;
};


const findLessonOrThrow = async (id) => {
    const lesson = await Lesson.findByPk(id, {
        include: [{ model: Course, as: 'course' }]
    });

    if (!lesson) { throw appError.from(LESSON_ERRORS.NOT_FOUND); }

    return lesson;
};


const listLessonsByCourse = async (courseId, user) => {
    const course = await findCourseOrThrow(courseId);

    if (!(await canAccessLessons(course, user))) {
        throw appError.from(LESSON_ERRORS.NOT_ENROLLED);
    }

    return Lesson.findAll({
        where: { courseId },

        order: [['order', 'ASC']]
    });
};


const getLessonById = async (id, user) => {
    const lesson = await findLessonOrThrow(id);

    if (!(await canAccessLessons(lesson.course, user))) {
        throw appError.from(LESSON_ERRORS.NOT_ENROLLED);
    }

    return lesson;
};


const createLesson = async (courseId, user, body) => {
    const course = await findCourseOrThrow(courseId);

    if (!isOwnerOrAdmin(course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER); }

    const data = pickLessonFields(body);

    assertDuration(data.duration);

    await assertOrderFree(courseId, data.order);

    return Lesson.create({ ...data, courseId });
};


const updateLesson = async (id, user, body) => {
    const lesson = await findLessonOrThrow(id);

    if (!isOwnerOrAdmin(lesson.course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER); }

    const data = pickLessonFields(body);

    assertDuration(data.duration);

    if (data.order !== undefined && data.order !== lesson.order) {
        await assertOrderFree(lesson.courseId, data.order, lesson.id);
    }

    await lesson.update(data);

    return Lesson.findByPk(id);
};


const deleteLesson = async (id, user) => {
    const lesson = await findLessonOrThrow(id);

    if (!isOwnerOrAdmin(lesson.course, user)) { throw appError.from(COURSE_ERRORS.NOT_OWNER); }

    await lesson.destroy();
};


module.exports = {
    listLessonsByCourse,

    getLessonById,

    createLesson,

    updateLesson,

    deleteLesson,

    canAccessLessons
};
