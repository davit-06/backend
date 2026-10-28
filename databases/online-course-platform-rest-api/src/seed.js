const bcrypt = require('bcrypt');

const { sequelize, ensureDatabaseExists } = require('./config/database');

const { User, Course, Lesson, Enrollment } = require('./models');

const ROLES = require('./constants/roles');


const USERS = [
    { fullName: 'Admin User', email: 'admin@example.com', password: 'admin123', role: ROLES.ADMIN },

    { fullName: 'Instructor User', email: 'instructor@example.com', password: 'instructor123', role: ROLES.INSTRUCTOR },

    { fullName: 'Second Instructor', email: 'instructor2@example.com', password: 'instructor123', role: ROLES.INSTRUCTOR },

    { fullName: 'Student User', email: 'student@example.com', password: 'student123', role: ROLES.STUDENT }
];


const COURSES = [
    {
        title: 'Node.js for Beginners',

        description: 'Learn the basics of Node.js and build your first server.',

        category: 'Programming',

        level: 'beginner',

        price: 0,

        isPublished: true,

        lessons: [
            { title: 'What is Node.js', content: 'Introduction to the Node.js runtime.', duration: 10, order: 1 },

            { title: 'Modules and npm', content: 'CommonJS modules and the npm ecosystem.', duration: 15, order: 2 },

            { title: 'Building an HTTP server', content: 'Create a server with Express.', duration: 25, order: 3 }
        ]
    },

    {
        title: 'Advanced Sequelize',

        description: 'Associations, transactions and query optimization with Sequelize.',

        category: 'Programming',

        level: 'advanced',

        price: 49.99,

        isPublished: true,

        lessons: [
            { title: 'Associations deep dive', content: 'hasMany, belongsTo, belongsToMany.', duration: 30, order: 1 },

            { title: 'Transactions', content: 'Managed and unmanaged transactions.', duration: 20, order: 2 }
        ]
    },

    {
        title: 'UI Design Basics (Draft)',

        description: 'An unpublished draft course about interface design.',

        category: 'Design',

        level: 'beginner',

        price: 19.5,

        isPublished: false,

        lessons: [
            { title: 'Color and typography', content: 'Fundamentals of visual design.', duration: 12, order: 1 }
        ]
    }
];


const seed = async () => {
    try {
        await ensureDatabaseExists();

        await sequelize.authenticate();

        await sequelize.sync({ alter: true });

        const users = {};

        for (const data of USERS) {
            const [user] = await User.findOrCreate({
                where: { email: data.email },

                defaults: {
                    fullName: data.fullName,

                    password: await bcrypt.hash(data.password, 10),

                    role: data.role
                }
            });

            users[data.email] = user;
        }

        for (const data of COURSES) {
            const { lessons, ...courseData } = data;

            const [course] = await Course.findOrCreate({
                where: { title: courseData.title, instructorId: users['instructor@example.com'].id },

                defaults: courseData
            });

            for (const lesson of lessons) {
                await Lesson.findOrCreate({
                    where: { courseId: course.id, order: lesson.order },

                    defaults: lesson
                });
            }
        }

        const firstCourse = await Course.findOne({ where: { title: COURSES[0].title } });

        await Enrollment.findOrCreate({
            where: { userId: users['student@example.com'].id, courseId: firstCourse.id }
        });

        console.log('Seed completed');

        USERS.forEach((user) => console.log(`${user.role}: ${user.email} / ${user.password}`));

        await sequelize.close();
    }

    catch (err) {
        console.error('Seed failed:', err.message);

        process.exit(1);
    }
};


seed();
