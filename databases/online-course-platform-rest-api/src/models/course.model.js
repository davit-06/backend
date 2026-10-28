const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/database');


const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'];


const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true
    },

    title: {
        type: DataTypes.STRING,

        allowNull: false,

        validate: { len: [3, 150] }
    },

    description: {
        type: DataTypes.TEXT,

        allowNull: false
    },

    category: {
        type: DataTypes.STRING,

        allowNull: false
    },

    level: {
        type: DataTypes.ENUM(...COURSE_LEVELS),

        allowNull: false,

        defaultValue: 'beginner'
    },

    price: {
        type: DataTypes.DECIMAL(10, 2),

        allowNull: false,

        validate: { min: 0 },

        get() {
            return Number(this.getDataValue('price'));
        }
    },

    isPublished: {
        type: DataTypes.BOOLEAN,

        allowNull: false,

        defaultValue: false
    }
}, {
    tableName: 'courses',

    timestamps: true
});


Course.LEVELS = COURSE_LEVELS;


module.exports = Course;
