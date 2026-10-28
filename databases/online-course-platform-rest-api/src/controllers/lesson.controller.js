const lessonService = require('../services/lesson.service');

const asyncHandler = require('../utils/asyncHandler');


const listLessons = asyncHandler(async (req, res) => {
    const lessons = await lessonService.listLessonsByCourse(Number(req.params.courseId), req.user);

    res.status(200).json({ success: true, data: lessons });
});


const getLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.getLessonById(Number(req.params.id), req.user);
    
    res.status(200).json({ success: true, data: lesson });
});


const createLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.createLesson(Number(req.params.courseId), req.user, req.body);
    
    res.status(201).json({ success: true, data: lesson });
});


const updateLesson = asyncHandler(async (req, res) => {
    const lesson = await lessonService.updateLesson(Number(req.params.id), req.user, req.body);
    
    res.status(200).json({ success: true, data: lesson });
});


const deleteLesson = asyncHandler(async (req, res) => {
    await lessonService.deleteLesson(Number(req.params.id), req.user);
    
    res.status(200).json({ success: true, data: { message: 'Lesson deleted successfully' } });
});



module.exports = { listLessons, getLesson, createLesson, updateLesson, deleteLesson };