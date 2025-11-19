import { DataTypes } from 'sequelize';
import { database } from '../config/database.js';

export const Answers = database.define('Answers', {
     id: {
        type: DataTypes.UUID, // Mude para UUID
        defaultValue: DataTypes.UUIDV4, // Adicione o gerador de UUID v4
        primaryKey: true,
        allowNull: false, // Garante que não será nulo
        unique: true // Garante a unicidade (primaryKey já implica isso, mas é bom ser explícito)
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
        type: DataTypes.UUID,
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