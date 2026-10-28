const express = require('express');

const enrollmentController = require('../controllers/enrollment.controller');

const { authenticate, authorize } = require('../middlewares/auth.middleware');

const ROLES = require('../constants/roles');


const router = express.Router();


router.use(authenticate);


router.post('/', authorize(ROLES.STUDENT), enrollmentController.enroll);

router.get('/me', authorize(ROLES.STUDENT), enrollmentController.listMyEnrollments);

router.get('/', authorize(ROLES.ADMIN), enrollmentController.listAllEnrollments);

router.patch(
    '/:id/progress',

    authorize(ROLES.STUDENT),

    enrollmentController.updateProgress
);

router.delete(
    '/:id',

    authorize(ROLES.STUDENT, ROLES.ADMIN),

    enrollmentController.cancelEnrollment
);


module.exports = router;
