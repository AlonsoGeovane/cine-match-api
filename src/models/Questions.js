import { DataTypes } from 'sequelize';
import { database } from '../config/database.js';
import { text } from 'express';

export const Questions = database.define('Questions',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    options: {
        type: DataTypes.JSON,
        allowNull: false,
    }
}, {
    tableName: 'questions',
    timestamps: false
});