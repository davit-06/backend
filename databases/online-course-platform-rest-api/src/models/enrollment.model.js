const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/database');


const ENROLLMENT_STATUSES = ['active', 'completed', 'cancelled'];


const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true
    },

    status: {
        type: DataTypes.ENUM(...ENROLLMENT_STATUSES),

        allowNull: false,

        defaultValue: 'active'
    },

    progress: {
        type: DataTypes.INTEGER,

        allowNull: false,

        defaultValue: 0,

        validate: { min: 0, max: 100 }
    },

    enrolledAt: {
        type: DataTypes.DATE,

        allowNull: false,

        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'enrollments',

    timestamps: true,

    indexes: [
        { unique: true, fields: ['userId', 'courseId'] }
    ]
});


Enrollment.STATUSES = ENROLLMENT_STATUSES;


module.exports = Enrollment;
