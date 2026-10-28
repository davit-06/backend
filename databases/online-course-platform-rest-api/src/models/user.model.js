const { DataTypes } = require('sequelize');

const { sequelize } = require('../config/database');

const ROLES = require('../constants/roles');


const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true
    },

    fullName: {
        type: DataTypes.STRING,

        allowNull: false,

        validate: { len: [2, 100] }
    },

    email: {
        type: DataTypes.STRING,

        allowNull: false,

        unique: true,

        validate: { isEmail: true }
    },

    password: {
        type: DataTypes.STRING,

        allowNull: false
    },

    role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),

        allowNull: false,

        defaultValue: ROLES.STUDENT
    }
}, {
    tableName: 'users',

    timestamps: true,

    defaultScope: { attributes: { exclude: ['password'] } },

    scopes: { withPassword: { attributes: { include: ['password'] } } }
});


User.prototype.toJSON = function () {
    const values = { ...this.get() };

    delete values.password;

    return values;
};


module.exports = User;
