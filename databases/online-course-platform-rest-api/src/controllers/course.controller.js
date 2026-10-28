const courseService = require('../services/course.service');


const asyncHandler = require('../utils/asyncHandler');

const listCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.listPublishedCourses(req.query);

    res.status(200).json({ success: true, data: courses });
});

const listMyCourses = asyncHandler(async (req, res) => {
    const courses = await courseService.listMyCourses(req.user, req.query);

    res.status(200).json({ success: true, data: courses });
});

const getCourse = asyncHandler(async (req, res) => {
    const course = await courseService.getCourseById(Number(req.params.id), req.user);

    res.status(200).json({ success: true, data: course });
});

const createCourse = asyncHandler(async (req, res) => {
    const course = await courseService.createCourse(req.user, req.body);

    res.status(201).json({ success: true, data: course });
});

const updateCourse = asyncHandler(async (req, res) => {
    const course = await courseService.updateCourse(Number(req.params.id), req.user, req.body);

    res.status(200).json({ success: true, data: course });
});

const deleteCourse = asyncHandler(async (req, res) => {
    await courseService.deleteCourse(Number(req.params.id), req.user);

    res.status(200).json({ success: true, data: { message: 'Course deleted successfully' } });
});

const listCourseStudents = asyncHandler(async (req, res) => {
    const students = await courseService.listCourseStudents(
        Number(req.params.id),

        req.user,

        req.query
    );

    res.status(200).json({ success: true, data: students });
});

module.exports = { listCourses, listMyCourses, getCourse, createCourse, updateCourse, deleteCourse, listCourseStudents };