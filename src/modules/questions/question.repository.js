import { Questions } from "../../models/questions.js";

export const makeQuestionRepoSequelize = () => {
    const findAll = async () => {
        const questions = await Questions.findAll({
        });
        return questions.map(q => q.toJSON());
    }

    const findById = async (id) => {
        const question = await Questions.findById(id);
        return question ? question.toJSON() : null;
    }

    return { findAll, findById }
}