import { database } from "../config/database.js";
import { env } from "../config/env.js";
import { Answers } from "./answers.js";
import { Questions } from "./questions.js";
import { Movie } from "./Movie.js";

Questions.hasMany(Answers, {
    foreignKey: 'question_id',
    as: 'answers'
});

Answers.belongsTo(Questions, {
    foreignKey: 'question_id',
    as: 'question'
});

if (env.nodeEnv === 'development') {
    database.sync({ alter: true }) // <--- MUDANÇA AQUI: de 'alter: true' para 'force: true'
        .then(() => console.log('✅ Models synced '))
        .catch(err => console.error('❌ Sync error :', err));
}

export { database, Movie, Questions, Answers };
