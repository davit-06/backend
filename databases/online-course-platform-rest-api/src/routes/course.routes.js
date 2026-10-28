const express = require('express');

const courseController = require('../controllers/course.controller');

const { authenticate, optionalAuthenticate, authorize } = require('../middlewares/auth.middleware');

const ROLES = require('../constants/roles');


const router = express.Router();


router.get('/', courseController.listCourses);

router.get('/my', authenticate, authorize(ROLES.INSTRUCTOR), courseController.listMyCourses);

router.get('/:id', optionalAuthenticate, courseController.getCourse);

router.post(
    '/',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    courseController.createCourse
);

router.put(
    '/:id',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    courseController.updateCourse
);

router.delete(
    '/:id',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    courseController.deleteCourse
);

router.get(
    '/:id/students',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    courseController.listCourseStudents
);


module.exports = router;
