const express = require('express');

const lessonController = require('../controllers/lesson.controller');

const { authenticate, authorize } = require('../middlewares/auth.middleware');

const ROLES = require('../constants/roles');


const router = express.Router();


router.get(
    '/courses/:courseId/lessons',

    authenticate,

    lessonController.listLessons
);

router.post(
    '/courses/:courseId/lessons',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    lessonController.createLesson
);

router.get('/lessons/:id', authenticate, lessonController.getLesson);

router.put(
    '/lessons/:id',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    lessonController.updateLesson
);

router.delete(
    '/lessons/:id',

    authenticate,

    authorize(ROLES.INSTRUCTOR, ROLES.ADMIN),

    lessonController.deleteLesson
);


module.exports = router;
