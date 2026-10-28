const { User, Course, Enrollment } = require('../models');

const appError = require('../utils/appError');

const ROLES = require('../constants/roles');

const COURSE_ERRORS = require('../constants/errors/course.errors');

const ENROLLMENT_ERRORS = require('../constants/errors/enrollment.errors');


const USER_ATTRIBUTES = ['id', 'fullName', 'email'];

const courseWithInstructor = {
    model: Course,

    as: 'course',

    include: [{ model: User, as: 'instructor', attributes: USER_ATTRIBUTES }]
};


const findEnrollmentOrThrow = async (id) => {
    const enrollment = await Enrollment.findByPk(id);

    if (!enrollment) { throw appError.from(ENROLLMENT_ERRORS.NOT_FOUND); }

    return enrollment;
};


const findEnrollmentWithDetails = (id) => {
    return Enrollment.findByPk(id, { include: [courseWithInstructor] });
};


const enroll = async (user, courseId) => {
    const course = await Course.findByPk(courseId);

    if (!course) { throw appError.from(COURSE_ERRORS.NOT_FOUND); }

    if (!course.isPublished) { throw appError.from(COURSE_ERRORS.NOT_PUBLISHED); }

    if (course.instructorId === user.id) { throw appError.from(ENROLLMENT_ERRORS.OWN_COURSE); }

    const existing = await Enrollment.findOne({ where: { userId: user.id, courseId } });

    if (existing && existing.status !== 'cancelled') {
        throw appError.from(ENROLLMENT_ERRORS.ALREADY_ENROLLED);
    }

    if (existing) {
        await existing.update({ status: 'active', enrolledAt: new Date() });

        return findEnrollmentWithDetails(existing.id);
    }

    const created = await Enrollment.create({ userId: user.id, courseId });

    return findEnrollmentWithDetails(created.id);
};


const listMyEnrollments = async (user, query) => {
    return Enrollment.findAll({
        where: { userId: user.id },

        include: [courseWithInstructor],

        order: [['enrolledAt', 'DESC'], ['id', 'DESC']]
    });
};


const listAllEnrollments = async (query) => {
    return Enrollment.findAll({
        include: [
            { model: User, as: 'user', attributes: USER_ATTRIBUTES },

            { model: Course, as: 'course' }
        ],

        order: [['id', 'ASC']]
    });
};


const updateProgress = async (user, id, progress) => {
    const enrollment = await findEnrollmentOrThrow(id);

    if (enrollment.userId !== user.id) { throw appError.from(ENROLLMENT_ERRORS.NOT_OWNER); }

    if (enrollment.status === 'cancelled') { throw appError.from(ENROLLMENT_ERRORS.CANCELLED); }

    if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
        throw appError.from(ENROLLMENT_ERRORS.INVALID_PROGRESS);
    }

    enrollment.progress = progress;

    enrollment.status = progress === 100 ? 'completed' : 'active';

    await enrollment.save();

    return enrollment;
};


const cancelEnrollment = async (user, id) => {
    const enrollment = await findEnrollmentOrThrow(id);

    if (user.role !== ROLES.ADMIN && enrollment.userId !== user.id) {
        throw appError.from(ENROLLMENT_ERRORS.NOT_OWNER);
    }

    if (enrollment.status === 'cancelled') { throw appError.from(ENROLLMENT_ERRORS.ALREADY_CANCELLED); }

    enrollment.status = 'cancelled';

    await enrollment.save();

    return enrollment;
};


module.exports = { enroll, listMyEnrollments, listAllEnrollments, updateProgress, cancelEnrollment };
