import { Sequelize } from 'sequelize';

export const database = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Arquivo do banco
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true, // createdAt, updatedAt automáticos
        underscored: true, // snake_case no banco (user_id)
        freezeTableName: false // Pluraliza nomes (User → users)
    }
});