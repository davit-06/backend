const enrollmentService = require('../services/enrollment.service');

const asyncHandler = require('../utils/asyncHandler');


const enroll = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.enroll(req.user, req.body.courseId);
    
    res.status(201).json({ success: true, data: enrollment });
});


const listMyEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.listMyEnrollments(req.user, req.query);
    
    res.status(200).json({ success: true, data: enrollments });
});


const listAllEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await enrollmentService.listAllEnrollments(req.query);
    
    res.status(200).json({ success: true, data: enrollments });
});


const updateProgress = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.updateProgress(req.user, Number(req.params.id), req.body.progress);

    res.status(200).json({ success: true, data: enrollment });
});


const cancelEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await enrollmentService.cancelEnrollment(req.user, Number(req.params.id));
    
    res.status(200).json({ success: true, data: enrollment });
});


module.exports = { enroll, listMyEnrollments, listAllEnrollments, updateProgress, cancelEnrollment, };