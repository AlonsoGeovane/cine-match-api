import { DataTypes } from 'sequelize';
import { database } from '../config/database.js';
import { text } from 'express';

export const Questions = database.define('Questions', {
    id: {
        type: DataTypes.UUID, // Mude para UUID
        defaultValue: DataTypes.UUIDV4, // Adicione o gerador de UUID v4
        primaryKey: true,
        allowNull: false, // Garante que não será nulo
        unique: true // Garante a unicidade (primaryKey já implica isso, mas é bom ser explícito)
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
    timestamps: true
});