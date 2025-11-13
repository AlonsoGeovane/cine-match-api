import { DataTypes } from 'sequelize';
import { database } from '../config/database.js';
import { text } from 'express';

export const Answers = database.define('Answers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'session_id'
    },
    answer: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    question_id: {
        type: DataTypes.INTEGER,
        field: 'question_id',
        references: {
            model: 'questions',
            key: 'id'
        }
    }
}, {
    tableName: 'answers',
    timestamps: true
});